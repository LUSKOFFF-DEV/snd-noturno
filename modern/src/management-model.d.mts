export type Metrics={total:number;done:number;timed:number;onTime:number;critical:number;criticalOn:number;inc:number;open:number};
export type Row=Metrics&{date:string};
export function management(rows:Row[],options:{days:number;parity:string;today:string}):{rows:Row[];sums:Metrics;from:string;today:string};
export function percent(n:number,d:number):string;
