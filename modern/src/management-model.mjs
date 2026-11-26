export function management(rows,{days=30,parity='all',today}){
 const start=new Date(today+'T12:00:00Z');start.setUTCDate(start.getUTCDate()-days+1);const from=start.toISOString().slice(0,10);
 const filtered=rows.filter(r=>r.date>=from&&r.date<=today&&(parity==='all'||Number(r.date.slice(-2))%2===Number(parity))).sort((a,b)=>b.date.localeCompare(a.date));
 const sums={total:0,done:0,timed:0,onTime:0,critical:0,criticalOn:0,inc:0,open:0};
 for(const r of filtered)for(const k of Object.keys(sums))sums[k]+=r[k];
 return {rows:filtered,sums,from,today};
}
export const percent=(n,d)=>d?Math.round(100*n/d)+'%':'—';
