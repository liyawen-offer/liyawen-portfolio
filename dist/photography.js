(() => {
'use strict';
const photos=window.PHOTOGRAPHY||[];
const section=document.getElementById('photography');
const extra=document.getElementById('photography-all');
const toggle=document.getElementById('photography-toggle');
const collapse=document.getElementById('photography-collapse');
const count=document.getElementById('photography-count');
const dialog=document.getElementById('photo-dialog');
const image=document.getElementById('photo-large');
const caption=document.getElementById('photo-caption');
let current=0,lastTrigger,priorOverflow='';
function setExpanded(expanded){
 extra.hidden=!expanded;
 toggle.setAttribute('aria-expanded',String(expanded));
 toggle.textContent=expanded?'收起完整画廊 −':'查看全部 '+photos.length+' 组作品 ＋';
 count.textContent=expanded?'全部 '+photos.length+' 组 · 点击任意作品放大':'精选 4 组 / 共 '+photos.length+' 组 · 点击作品放大';
 if(expanded) extra.querySelectorAll('img[data-src]').forEach(img=>{img.src=img.dataset.src;img.removeAttribute('data-src');});
}
toggle.addEventListener('click',()=>setExpanded(extra.hidden));
collapse.addEventListener('click',()=>{setExpanded(false);toggle.focus();});
function renderPhoto(){
 const photo=photos[current];
 image.alt=photo.alt;
 image.src=photo.full;
 caption.textContent=String(current+1).padStart(2,'0')+' / '+photos.length+' · '+photo.category;
}
section.querySelectorAll('a[data-photo-index]').forEach(link=>link.addEventListener('click',event=>{
 event.preventDefault();current=Number(link.dataset.photoIndex);lastTrigger=link;renderPhoto();
 priorOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
 dialog.showModal();document.getElementById('photo-close').focus();
}));
document.getElementById('photo-close').addEventListener('click',()=>dialog.close());
document.getElementById('photo-prev').addEventListener('click',()=>{current=(current-1+photos.length)%photos.length;renderPhoto();});
document.getElementById('photo-next').addEventListener('click',()=>{current=(current+1)%photos.length;renderPhoto();});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();current=(current+(event.key==='ArrowRight'?1:-1)+photos.length)%photos.length;renderPhoto();}});
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
dialog.addEventListener('close',()=>{document.body.style.overflow=priorOverflow;lastTrigger?.focus();});
})();