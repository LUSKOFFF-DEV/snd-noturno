import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
const html=readFileSync('../index.html','utf8');mkdirSync('src',{recursive:true});mkdirSync('public',{recursive:true});
const css=html.match(/<style>([\s\S]*?)<\/style>/)?.[1];let engine=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];if(!css||!engine)throw Error('Motor original não encontrado');
const start=engine.indexOf("$('nav').innerHTML="),end=engine.indexOf(';let h=',start);if(start<0||end<0)throw Error('Navegação incompatível');engine=engine.slice(0,start)+"window.dispatchEvent(new CustomEvent('snd-tab',{detail:tab}))"+engine.slice(end);
engine=engine.replace(/if\('serviceWorker'in navigator&&location\.protocol\.startsWith\('http'\)\)navigator\.serviceWorker\.register\([^\n]*?\.catch\(\(\)=>\{\}\);/,"");
if(engine.includes("serviceWorker.register"))throw Error('Registro duplicado de service worker');
engine=engine.replaceAll('V2.1','V2.2');
writeFileSync('src/engine.js',engine);writeFileSync('src/legacy.css',css);for(const name of ['manifest.json','icon.svg','icon-192.png','icon-512.png'])copyFileSync('../'+name,'public/'+name);