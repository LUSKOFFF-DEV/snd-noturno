import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
const html=readFileSync('../index.html','utf8');mkdirSync('src',{recursive:true});mkdirSync('public',{recursive:true});
const css=html.match(/<style>([\s\S]*?)<\/style>/)?.[1];let engine=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];if(!css||!engine)throw Error('Motor original não encontrado');
const start=engine.indexOf("$('nav').innerHTML="),end=engine.indexOf(';let h=',start);if(start<0||end<0)throw Error('Navegação incompatível');engine=engine.slice(0,start)+"window.dispatchEvent(new CustomEvent('snd-tab',{detail:tab}))"+engine.slice(end);
engine=engine.replace(/if\('serviceWorker'in navigator&&location\.protocol\.startsWith\('http'\)\)navigator\.serviceWorker\.register\([^\n]*?\.catch\(\(\)=>\{\}\);/,"");
if(engine.includes("serviceWorker.register"))throw Error('Registro duplicado de service worker');
const hook="$('app').innerHTML=h;refreshSaveState();updateCritical()";
if(!engine.includes(hook))throw Error('Render incompatível');
engine=engine.replace(hook,hook+";publishCockpit()");
engine=engine.replace("migrateSchedule18();render();setInterval", "migrateSchedule18();render();setInterval");
const saved="loadedRaw=raw;saveFailed=false;",restored="loadedRaw=raw;blocked=false;saveFailed=false;";
if(!engine.includes(saved)||!engine.includes(restored))throw Error('Persistência incompatível');
engine=engine.replace(saved,saved+"journalCheckpoint(raw);").replace(restored,restored+"journalCheckpoint(raw);");
engine="import {checkpoint,history} from './local-journal';\n"+engine;
engine=engine.replaceAll('V2.1','V2.4');
engine+=`
function publishCockpit(){let s=shift();window.dispatchEvent(new CustomEvent('snd-cockpit',{detail:{date:selected,current:selected===currentShift(),tasks:s.tasks.map(t=>({id:t.id,title:t.title,time:t.time,priority:t.priority,status:t.status,role:t.role,due:deadline(selected,t.time)})),received:!!s.receiving.confirmed,blocked:blocked||saveFailed,at:Date.now()}}))}
window.addEventListener('snd-cockpit-action',e=>{let d=e.detail,s=shift(),t=s.tasks.find(x=>x.id===d.id);if(d.kind==='handoff'||d.kind==='receive'){tab=d.kind==='handoff'?'passagem':'recebimento';render();return}if(!t)return;if(d.kind==='jump'){tab='plantao';filter='Todos';render();let el=[...document.querySelectorAll('[data-task]')].find(x=>x.dataset.task===t.id);el?.scrollIntoView({block:'center'});return}if(blocked||saveFailed||t.status==='done')return;let b=document.createElement('button');b.dataset.action='status';b.dataset.id=t.id;b.dataset.value=d.kind==='done'?'done':'pending';b.hidden=true;document.body.append(b);try{b.click()}finally{b.remove()}});
function journalCheckpoint(raw){checkpoint(raw).then(()=>window.dispatchEvent(new CustomEvent('snd-journal-state',{detail:'ready'}))).catch(()=>window.dispatchEvent(new CustomEvent('snd-journal-state',{detail:'error'})))}
window.addEventListener('snd-journal-export',async()=>{try{let entries=await history();if(!entries.length){alert('Nenhuma cópia de recuperação disponível.');return}download('snd-recuperacao-indexeddb.json',JSON.parse(entries[0].raw))}catch(e){alert('Não foi possível exportar a cópia: '+e.message)}});
if(!blocked&&loadedRaw!==null)journalCheckpoint(loadedRaw);
publishCockpit();
`;
writeFileSync('src/engine.js',engine);writeFileSync('src/legacy.css',css);for(const name of ['manifest.json','icon.svg','icon-192.png','icon-512.png'])copyFileSync('../'+name,'public/'+name);