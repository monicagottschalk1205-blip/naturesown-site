// Shared + home-page behaviour. Each block only runs if its elements exist on the page.
const $=s=>document.querySelector(s);

// Loader (home page only)
const loader=$('#loader');
if(loader){
  addEventListener('load',()=>setTimeout(()=>loader.classList.add('done'),1100));
  setTimeout(()=>loader.classList.add('done'),2500);
}

// Header
const hd=$('header');
const onScroll=()=>hd.classList.toggle('solid',scrollY>60||!$('#top'));onScroll();addEventListener('scroll',onScroll);
const nav=$('#nav');
$('#burger').onclick=()=>nav.classList.toggle('open');
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Hero slider: crossfade + slow zoom, arrows, dots, swipe
if($('.slide')){
  const slides=[...document.querySelectorAll('.slide')],dotsEl=$('#dots');
  const DUR=5500;let cur=0,timer;
  dotsEl.style.setProperty('--dur',DUR+'ms');
  slides.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Slide '+(i+1));b.onclick=()=>{go(i);restart()};dotsEl.appendChild(b)});
  const dots=[...dotsEl.children];
  const mark=()=>dots.forEach((d,i)=>{d.classList.remove('on');if(i===cur){void d.offsetWidth;d.classList.add('on')}});
  function go(n){n=(n+slides.length)%slides.length;if(n===cur)return;slides[cur].classList.remove('active');slides[n].classList.add('active');cur=n;mark()}
  function restart(){clearInterval(timer);timer=setInterval(()=>go(cur+1),DUR)}
  $('#next').onclick=()=>{go(cur+1);restart()};
  $('#prev').onclick=()=>{go(cur-1);restart()};
  const heroEl=$('#top');let sx=null;
  heroEl.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
  heroEl.addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50){go(cur+(d<0?1:-1));restart()}sx=null});
  addEventListener('keydown',e=>{if(e.key==='ArrowRight'){go(cur+1);restart()}if(e.key==='ArrowLeft'){go(cur-1);restart()}});
  mark();restart();
}

// Scroll reveals
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
document.querySelectorAll('.rv,.cluster').forEach((el,i)=>{if(!el.classList.contains('cluster'))el.style.transitionDelay=((i%4)*80)+'ms';io.observe(el)});

// Reviews
if($('.rev')){
  const revs=[...document.querySelectorAll('.rev')],rd=$('#rdots');let ri=0,rt;
  revs.forEach((_,i)=>{const b=document.createElement('button');b.onclick=()=>{show(i);rr()};rd.appendChild(b)});
  function show(i){ri=i;revs.forEach((r,k)=>r.classList.toggle('on',k===i));[...rd.children].forEach((d,k)=>d.classList.toggle('on',k===i))}
  function rr(){clearInterval(rt);rt=setInterval(()=>show((ri+1)%revs.length),5500)}
  show(0);rr();
}

// Popup (home page, once per browser session)
const pop=$('#pop');
if(pop){
  const closePop=()=>{pop.classList.remove('show');sessionStorage.setItem('popSeen','1')};
  if(!sessionStorage.getItem('popSeen'))setTimeout(()=>pop.classList.add('show'),8000);
  $('#px').onclick=closePop;$('#pno').onclick=closePop;
  pop.onclick=e=>{if(e.target===pop)closePop()};
  addEventListener('keydown',e=>{if(e.key==='Escape')closePop()});
}

// Contact form: opens the visitor's email app addressed to the store
const form=$('#contactForm');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const f=new FormData(form);
    const body='Name: '+f.get('first')+' '+f.get('last')+'\nEmail: '+f.get('email')+'\n\n'+f.get('message');
    location.href='mailto:nfonohm@gmail.com?subject='+encodeURIComponent(f.get('subject')||'Website message')+'&body='+encodeURIComponent(body);
  });
}
