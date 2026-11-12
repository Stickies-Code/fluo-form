(()=>{
const A='assets/casos/';
const S={
 posts:{me:'Hazme publicaciones para Instagram de este producto nuevo.',att:[A+'hidrogest-p1-antes.jpg','iBOT PRO VISION NG.jpg'],
  ai1:'¡Me pongo con ello!',ai2:'Te he preparado 4 estilos con tu imagen. Elige tu favorito y lo replico en el resto de productos.',
  res:`<div class="res g4">${[1,2,3,4].map(i=>`<div class="pick"><img src="${A}hidrogest-p${i}-despues.jpg"></div>`).join('')}</div>`},
 video:{me:'Edita este vídeo: quita los silencios, ponle subtítulos con nuestra marca y música.',att:[A+'hidrogest-p3-antes.jpg','video-riego.mov · 1:12'],
  ai1:'Vale, me pongo con ello.',ai2:'Hecho. Tu vídeo está listo para publicar.',
  res:`<div class="vid"><img src="${A}hidrogest-p3-antes.jpg" style="object-position:30% 60%;transform:scale(1.35)"><div class="play"></div><div class="sub">Riego automático <b>desde el móvil</b></div><div class="bar"></div></div><div class="done">✓ Silencios quitados · Subtítulos · Música</div>`},
 cal:{me:'Prepárame las publicaciones de diciembre.',att:null,
  ai1:'Perfecto, lo preparo.',ai2:'Aquí tienes diciembre: 12 publicaciones listas para que tu equipo las revise.',
  res:`<div class="cal-h"><span>Diciembre</span><span style="color:var(--green)">12 publicaciones</span></div><div class="cal">${Array.from({length:31},(_,i)=>`<span class="${[1,3,5,8,10,12,15,17,19,22,24,29].includes(i+1)?'p':''}">${i+1}</span>`).join('')}</div>`},
};
function who(){return '<div class="who"><i></i>TU SISTEMA FLU–O</div>'}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let run=0;
async function play(box,key){
 const id=++run;const s=S[key];box.innerHTML='';
 const add=(cls,html)=>{const d=document.createElement('div');d.className='msg '+cls;d.innerHTML=html;box.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('in')));box.scrollTop=box.scrollHeight;return d};
 await wait(300);if(id!==run)return;
 add('me',s.me+(s.att?`<div class="att"><img src="${s.att[0]}">${s.att[1]}</div>`:''));
 await wait(1000);if(id!==run)return;
 const t=add('ai',who()+'<div class="typing"><span></span><span></span><span></span></div>');
 await wait(1100);if(id!==run)return;
 t.innerHTML=who()+s.ai1;
 await wait(900);if(id!==run)return;
 const t2=add('ai',who()+'<div class="typing"><span></span><span></span><span></span></div>');
 await wait(1600);if(id!==run)return;
 t2.innerHTML=who()+s.ai2+s.res;box.scrollTop=box.scrollHeight;
}
document.querySelectorAll('[data-chat]').forEach(box=>{
 const sec=box.closest('section');const tabs=sec.querySelectorAll('.dm-tab');let cur='posts',started=false;
 tabs.forEach(t=>t.onclick=()=>{tabs.forEach(x=>x.classList.toggle('on',x===t));cur=t.dataset.k;play(box,cur)});
 new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting&&!started){started=true;play(box,cur)}})},{threshold:.35}).observe(box);
});

})();
