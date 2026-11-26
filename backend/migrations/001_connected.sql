-- Foundation only. Run on an approved Supabase project, never on production without review.
begin;
create table public.snd_units(id uuid primary key default gen_random_uuid(), name text not null);
create table public.snd_members(unit_id uuid references public.snd_units on delete cascade,user_id uuid references auth.users on delete cascade,role text not null check(role in ('tecnico','nutricionista','administrativo','gestao')),primary key(unit_id,user_id));
create table public.snd_shifts(unit_id uuid references public.snd_units on delete cascade, shift_date date not null, payload jsonb not null check(jsonb_typeof(payload)='object'), revision bigint not null default 1, updated_at timestamptz not null default now(), updated_by uuid references auth.users,primary key(unit_id,shift_date));
create table public.snd_changes(id bigint generated always as identity primary key,unit_id uuid not null,shift_date date not null,revision bigint not null,actor uuid not null,changed_at timestamptz not null default now(),unique(unit_id,shift_date,revision));
alter table public.snd_units enable row level security;
alter table public.snd_members enable row level security;
alter table public.snd_shifts enable row level security;
alter table public.snd_changes enable row level security;
create policy own_membership on public.snd_members for select to authenticated using(user_id=auth.uid());
create policy member_units on public.snd_units for select to authenticated using(exists(select 1 from public.snd_members m where m.unit_id=id and m.user_id=auth.uid()));
create policy member_shifts on public.snd_shifts for select to authenticated using(exists(select 1 from public.snd_members m where m.unit_id=snd_shifts.unit_id and m.user_id=auth.uid()));
create policy management_changes on public.snd_changes for select to authenticated using(exists(select 1 from public.snd_members m where m.unit_id=snd_changes.unit_id and m.user_id=auth.uid() and m.role='gestao'));
revoke all on public.snd_units,public.snd_members,public.snd_shifts,public.snd_changes from anon,authenticated;
grant select on public.snd_units,public.snd_members,public.snd_shifts,public.snd_changes to authenticated;
create function public.snd_write_shift(p_unit uuid,p_date date,p_expected bigint,p_payload jsonb)
returns bigint language plpgsql security definer set search_path='' as $$
declare v_actor uuid:=auth.uid(); v_revision bigint;
begin
 if v_actor is null or not exists(select 1 from public.snd_members where unit_id=p_unit and user_id=v_actor and role in ('tecnico','nutricionista','gestao')) then raise exception 'access denied' using errcode='42501'; end if;
 if p_expected is null or p_expected<0 or p_date is null or p_payload is null or jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>2000000 then raise exception 'invalid payload' using errcode='22023'; end if;
 if p_expected=0 then
 insert into public.snd_shifts(unit_id,shift_date,payload,updated_by) values(p_unit,p_date,p_payload,v_actor) on conflict do nothing returning revision into v_revision;
 else
 update public.snd_shifts set payload=p_payload,revision=revision+1,updated_at=now(),updated_by=v_actor where unit_id=p_unit and shift_date=p_date and revision=p_expected returning revision into v_revision;
 end if;
 if v_revision is null then raise exception 'revision conflict' using errcode='40001'; end if;
 insert into public.snd_changes(unit_id,shift_date,revision,actor) values(p_unit,p_date,v_revision,v_actor);
 return v_revision;
end $$;
revoke all on function public.snd_write_shift(uuid,date,bigint,jsonb) from public,anon;
grant execute on function public.snd_write_shift(uuid,date,bigint,jsonb) to authenticated;
commit;
