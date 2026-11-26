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
engine="import {checkpoint,history} from './local-journal';\nimport {prevention} from './prevention.mjs';\nimport {encryptBackup,decryptBackup,digest} from './crypto-backup.mjs';\n"+engine;
engine=engine.replaceAll('V2.1','V2.7');
engine=engine.replace('let x=JSON.parse(await el.files[0].text());','let x=JSON.parse(await el.files[0].text());if(x?.format===\'snd-backup-encrypted-v1\'){if(d.mode===\'importStaff\')throw Error(\'Use Restaurar backup.\');let password=prompt(\'Senha do backup criptografado:\');if(password===null)return;x=JSON.parse(await decryptBackup(x,password));}');
engine+=`
function publishCockpit(){let s=shift();window.dispatchEvent(new CustomEvent('snd-cockpit',{detail:{date:selected,current:selected===currentShift(),tasks:s.tasks.map(t=>({id:t.id,title:t.title,time:t.time,priority:t.priority,status:t.status,role:t.role,due:deadline(selected,t.time)})),prevention:prevention(db.shifts,selected,Date.now(),deadline,recordedShift),received:!!s.receiving.confirmed,blocked:blocked||saveFailed,at:Date.now()}}))}
window.addEventListener('snd-cockpit-action',e=>{let d=e.detail,s=shift(),t=s.tasks.find(x=>x.id===d.id);if(d.kind==='handoff'||d.kind==='receive'){tab=d.kind==='handoff'?'passagem':'recebimento';render();return}if(!t)return;if(d.kind==='jump'){tab='plantao';filter='Todos';render();let el=[...document.querySelectorAll('[data-task]')].find(x=>x.dataset.task===t.id);el?.scrollIntoView({block:'center'});return}if(blocked||saveFailed||t.status==='done')return;let b=document.createElement('button');b.dataset.action='status';b.dataset.id=t.id;b.dataset.value=d.kind==='done'?'done':'pending';b.hidden=true;document.body.append(b);try{b.click()}finally{b.remove()}});
function journalCheckpoint(raw){checkpoint(raw).then(()=>window.dispatchEvent(new CustomEvent('snd-journal-state',{detail:'ready'}))).catch(()=>window.dispatchEvent(new CustomEvent('snd-journal-state',{detail:'error'})))}
window.addEventListener('snd-journal-export',async()=>{try{let entries=await history();if(!entries.length){alert('Nenhuma cópia de recuperação disponível.');return}let verified=null;for(let entry of entries){if(entry.sha256&&await digest(entry.raw)===entry.sha256){try{let candidate=JSON.parse(entry.raw);if(validBackup(candidate)){verified=candidate;break}}catch{}}}if(!verified)throw Error('Nenhuma cópia com integridade verificada. Preserve os backups externos.');download('snd-recuperacao-indexeddb.json',verified)}catch(e){alert('Não foi possível exportar a cópia: '+e.message)}});
window.addEventListener('snd-secure-export',async e=>{try{const payload=await encryptBackup(JSON.stringify(db),e.detail);download('snd-backup-protegido-'+selected+'.json',payload);window.dispatchEvent(new CustomEvent('snd-secure-result',{detail:{ok:true,message:'Backup criptografado gerado. Confira o arquivo baixado.'}}))}catch(err){window.dispatchEvent(new CustomEvent('snd-secure-result',{detail:{ok:false,message:err.message}}))}});
if(!blocked&&loadedRaw!==null)journalCheckpoint(loadedRaw);
publishCockpit();
`;
writeFileSync('src/engine.js',engine);writeFileSync('src/legacy.css',css);for(const name of ['manifest.json','icon.svg','icon-192.png','icon-512.png'])copyFileSync('../'+name,'public/'+name);