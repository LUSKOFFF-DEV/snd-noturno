export function management(rows,{days=30,parity='all',today}){
 const start=new Date(today+'T12:00:00Z');start.setUTCDate(start.getUTCDate()-days+1);const from=start.toISOString().slice(0,10);
 const filtered=rows.filter(r=>r.date>=from&&r.date<=today&&(parity==='all'||Number(r.date.slice(-2))%2===Number(parity))).sort((a,b)=>b.date.localeCompare(a.date));
 const sums={total:0,done:0,timed:0,onTime:0,critical:0,criticalOn:0,inc:0,open:0};
 for(const r of filtered)for(const k of Object.keys(sums))sums[k]+=r[k];
 return {rows:filtered,sums,from,today};
}
export const percent=(n,d)=>d?Math.round(100*n/d)+'%':'—';

export function analytics(rows,options){
 const current=management(rows,options), priorDate=new Date(current.from+'T12:00:00Z');priorDate.setUTCDate(priorDate.getUTCDate()-1);
 const previous=management(rows,{...options,today:priorDate.toISOString().slice(0,10)});
 const ratio=(n,d)=>d?100*n/d:null;
 const delta=(n,d,p,q)=>d&&q?Math.round((100*n/d-100*p/q)*10)/10:null;
 const groups=['0','1'].map(parity=>({parity,...management(rows,{...options,parity})}));
 const map=new Map();
 for(const row of current.rows)for(const task of row.tasks||[]){let x=map.get(task.id)||{id:task.id,title:task.title,n:0,affected:0,late:0,open:0,incident:0};x.n++;if(task.late)x.late++;if(task.open)x.open++;if(task.incident)x.incident++;if(task.late||task.open||task.incident)x.affected++;map.set(task.id,x)}
 const bottlenecks=[...map.values()].filter(x=>x.affected>=2).sort((a,b)=>b.affected-a.affected||b.affected/b.n-a.affected/a.n||a.title.localeCompare(b.title)).slice(0,5);
 return {previous,groups,bottlenecks,completionDelta:delta(current.sums.done,current.sums.total,previous.sums.done,previous.sums.total),punctualityDelta:delta(current.sums.onTime,current.sums.timed,previous.sums.onTime,previous.sums.timed)};
}
