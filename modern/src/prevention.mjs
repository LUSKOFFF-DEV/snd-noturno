// Observational signals, not calibrated predictions.
export function prevention(shifts,selected,now,deadline,recorded){
 const past=Object.values(shifts).filter(s=>s.date<selected&&deadline(s.date,'07:00')<=now&&recorded(s)&&Number(s.date.slice(-2))%2===Number(selected.slice(-2))%2).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10);
 const stats=new Map();
 for(const s of past){const seen=new Set();for(const t of s.tasks||[]){if(seen.has(t.id))continue;seen.add(t.id);const x=stats.get(t.id)||{id:t.id,n:0,affected:0,late:0,incident:0,open:0};x.n++;const late=t.status==='done'&&Number.isFinite(Date.parse(t.completed))&&Date.parse(t.completed)>deadline(s.date,t.time),incident=t.status==='pending'||(t.events||[]).some(e=>e.kind==='pending'),open=t.status!=='done';if(late)x.late++;if(incident)x.incident++;if(open)x.open++;if(late||incident||open)x.affected++;stats.set(t.id,x)}}
 return {sample:past.length,signals:[...stats.values()].filter(x=>x.n>=3&&x.affected>=2&&x.affected/x.n>=0.4)};
}
