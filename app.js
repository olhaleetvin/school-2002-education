const LESSONS = [
{ id:0, title:"01 • Дезінфекція та безпека", dur:"12:40", desc:"Чим відрізняється дезінфекція / ПСО / стерилізація. Крафт-пакети, журнал, як не нашкодити клієнту.", quiz:[
  {q:"Що йде першим після клієнта?", a:["Стерилізація в сухожарі","Дезінфекція в розчині","Опил форми"], c:1},
  {q:"Індикатор на крафт-пакеті потрібен щоб…", a:["було красиво","підтвердити стерилізацію","замінити журнал"], c:1},
  {q:"Скільки етапів обробки інструментів?", a:["1","2","3 — дезінфекція, ПСО, стерилізація"], c:2},
]},
{ id:1, title:"02 • Форма нігтя та опил", dur:"18:05", desc:"Квадрат, мигдаль, овал. Схема опилу без пропилів, кут пилки 90°.", quiz:[
  {q:"Під яким кутом тримаємо пилку на торці?", a:["45°","90°","180°"], c:1},
  {q:"З чого починаємо опил?", a:["з кутикули","з торця / довжини","з дизайну"], c:1},
  {q:"Абразив для натуральних нігтів?", a:["80 грит","180 грит","320 грит для шліфування"], c:1},
]},
{ id:2, title:"03 • Комбі-манікюр", dur:"24:30", desc:"Полум'я + кулька. Глибина, швидкість, без болю і ран.", quiz:[
  {q:"Фреза «полум'я» потрібна для…", a:["зняття довжини","підняття кутикули","полірування"], c:1},
  {q:"Ознака перегріву?", a:["клієнт мовчить","печіння / почервоніння","блиск"], c:1},
  {q:"Зріз кутикули робимо…", a:["кусачками одним полотном","ножицями рвучкими рухами","пилкою"], c:0},
]},
{ id:3, title:"04 • Покриття під кутикулу", dur:"21:15", desc:"База, вирівнювання, тонкий торець. Без затікань.", quiz:[
  {q:"Затікання бази веде до…", a:["відшарувань","міцності","блиску"], c:0},
  {q:"Скільки шарів бази в вирівнюванні?", a:["1 товстий одразу","2: тонкий + вирівнюючий","5"], c:1},
  {q:"Торець запечатуємо…", a:["товсто","тонко","не запечатуємо"], c:1},
]},
{ id:4, title:"05 • Дизайн та кріплення", dur:"16:50", desc:"Френч, втирка, стемпінг. Як закріпити щоб носилось 4 тижні.", quiz:[
  {q:"Втирку наносимо на…", a:["липкий шар","гарячий топ без липкості","матовий топ"], c:1},
  {q:"Дизайн перекриваємо…", a:["базою","топом з вирівнюванням","нічим"], c:1},
  {q:"Тріщини на торці — причина?", a:["тонкий торець без укріплення","довгі прогулянки","колір"], c:0},
]},
{ id:5, title:"06 • Педикюр + фото робіт / фінал", dur:"19:20", desc:"Специфіка стоп, гігієна, ракурси для портфоліо. Фінальний кейс.", quiz:[
  {q:"Для стоп не використовуємо…", a:["смарт-диски","агресивне зрізання кутів","крем"], c:1},
  {q:"Найкраще світло для фото?", a:["жовта лампа зверху","денне + макролінза","спалах в лоб"], c:1},
  {q:"Фінальний крок курсу?", a:["здати всі тести і отримати сертифікат","видалити фото","купити лампу"], c:0},
]},
];

const KEY="nails_proto_v1";
let state = JSON.parse(localStorage.getItem(KEY)||'{"watched":[],"passed":[]}');
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function isUnlocked(i){ return i===0 || state.passed.includes(i-1); }
function pct(){ return Math.round(state.passed.length/LESSONS.length*100); }

let current=null, watchedTemp=false;

function render(){
  document.getElementById('progressFill').style.width=pct()+"%";
  document.getElementById('progressPct').textContent=pct()+"%";
  document.getElementById('timeStat').textContent = `${state.passed.length*20} / 120 хв пройдено`;

  const rl=document.getElementById('roadmapList'); rl.innerHTML="";
  LESSONS.forEach((l,i)=>{
    const d=document.createElement('div');
    const st = state.passed.includes(i)?'done':(isUnlocked(i)?'current':'locked');
    d.className='road-item '+st;
    d.innerHTML=`<span>${state.passed.includes(i)?'✓':(isUnlocked(i)?'▶':'🔒')} ${l.title}</span><span>${state.passed.includes(i)?'100%':(isUnlocked(i)?'→':'замок')}</span>`;
    d.style.cursor=isUnlocked(i)?'pointer':'not-allowed';
    d.onclick=()=>{ if(isUnlocked(i)) openLesson(i); };
    rl.appendChild(d);
  });

  const ch=document.getElementById('lessonChips'); ch.innerHTML="";
  LESSONS.forEach((l,i)=>{
    const c=document.createElement('div');
    c.className='chip '+(isUnlocked(i)?(i===current?'on':''):'lock');
    c.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b><small>${isUnlocked(i)?'відкрито':'закрито'}</small>`;
    c.onclick=()=>{ if(isUnlocked(i)) openLesson(i); };
    ch.appendChild(c);
  });

  const pl=document.getElementById('programList'); pl.innerHTML="";
  LESSONS.forEach((l,i)=>{
    const c=document.createElement('div');
    c.className='card prog-card '+(isUnlocked(i)?'':'locked');
    c.innerHTML=`<div class="prog-top"><span class="tag ${i%2?'tag-pink':'tag-blue'}">${l.dur}</span><span>${state.passed.includes(i)?'✓ пройдено':(isUnlocked(i)?'● відкрито':'🔒 замок')}</span></div><h3>${l.title}</h3><p class="mono small">${l.desc}</p><button class="btn-black" ${isUnlocked(i)?'':'disabled style="opacity:.4"'}>${isUnlocked(i)?'Відкрити урок →':'Відкрий попередній тест'}</button>`;
    c.querySelector('button').onclick=()=>{ if(isUnlocked(i)){openLesson(i); document.getElementById('cabinet').scrollIntoView({behavior:'smooth'});} };
    pl.appendChild(c);
  });

  const cert=document.getElementById('certBlock');
  if(state.passed.length===LESSONS.length){cert.classList.remove('hidden'); document.getElementById('certDate').textContent=new Date().toLocaleDateString('uk-UA');}
  else cert.classList.add('hidden');
}

function openLesson(i){
  current=i; watchedTemp = state.watched?.includes(i);
  const l=LESSONS[i];
  document.getElementById('lvTitle').textContent=l.title;
  document.getElementById('lvTagBlue').textContent='УРОК '+(i+1)+' / 6';
  document.getElementById('lvMeta').textContent=`тривалість ${l.dur}`;
  document.getElementById('lvDesc').textContent=l.desc;
  document.getElementById('videoDur').textContent=l.dur;
  updateWatch();
  buildQuiz();
  render();
  document.getElementById('lessonView').scrollIntoView({behavior:'smooth',block:'center'});
}
function updateWatch(){
  document.getElementById('watchState').textContent='статус: '+(watchedTemp?'переглянуто ✓':'не переглянуто');
  document.getElementById('watchBtn').textContent=watchedTemp?'Переглянуто ✓':'Я переглянула відео ✓';
  document.getElementById('quizLock').style.display=watchedTemp?'none':'block';
  document.getElementById('checkBtn').disabled=!watchedTemp;
}
document.getElementById('watchBtn').onclick=()=>{
  if(current==null) return;
  watchedTemp=true;
  state.watched=[...new Set([...(state.watched||[]),current])]; save(); updateWatch();
};
document.getElementById('lvClose').onclick=()=>{current=null;};
document.getElementById('continueBtn').onclick=()=>{
  const next=LESSONS.findIndex((_,i)=>isUnlocked(i)&&!state.passed.includes(i));
  if(next>=0) openLesson(next); else alert('Все пройдено — забирай сертифікат нижче!');
};
document.getElementById('resetBtn').onclick=()=>{state={watched:[],passed:[]};save();current=null;render();};

function buildQuiz(){
  const box=document.getElementById('quiz'); box.innerHTML="";
  document.getElementById('quizResult').textContent="";
  LESSONS[current].quiz.forEach((item,qi)=>{
    const d=document.createElement('div'); d.className='q';
    d.innerHTML=`<b>${qi+1}. ${item.q}</b>`+item.a.map((t,ai)=>`<label><input type="radio" name="q${qi}" value="${ai}"> ${t}</label>`).join('');
    box.appendChild(d);
  });
}
document.getElementById('checkBtn').onclick=()=>{
  const items=LESSONS[current].quiz; let ok=0;
  items.forEach((it,qi)=>{
    const sel=document.querySelector(`input[name=q${qi}]:checked`);
    if(sel && +sel.value===it.c) ok++;
  });
  const res=document.getElementById('quizResult');
  if(ok>=2){
    res.textContent=`✅ ${ok}/3 — здано! Наступний урок розблоковано.`;
    res.style.color='green';
    if(!state.passed.includes(current)){state.passed.push(current); save();}
    setTimeout(()=>{render(); const n=current+1; if(n<LESSONS.length&&isUnlocked(n)) openLesson(n);},900);
  } else {
    res.textContent=`❌ ${ok}/3 — треба мінімум 2. Передивись відео і спробуй ще.`;
    res.style.color='#a00';
  }
  render();
};
render();
