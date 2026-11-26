export type Metrics={total:number;done:number;timed:number;onTime:number;critical:number;criticalOn:number;inc:number;open:number};
export type Row=Metrics&{date:string;tasks?:{id:string;title:string;late:boolean;open:boolean;incident:boolean}[]};
export function management(rows:Row[],options:{days:number;parity:string;today:string}):{rows:Row[];sums:Metrics;from:string;today:string};
export function percent(n:number,d:number):string;

export function analytics(rows:Row[],options:{days:number;parity:string;today:string}):{previous:ReturnType<typeof management>;groups:(ReturnType<typeof management>&{parity:string})[];bottlenecks:{id:string;title:string;n:number;affected:number;late:number;open:number;incident:number}[];completionDelta:number|null;punctualityDelta:number|null};
