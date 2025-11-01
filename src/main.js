import './styles.css';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

const db = [
  { id: 'c1', title: 'Modern JavaScript Bootcamp', category: 'Web Dev', level: 'Beginner', price: 39, rating: 4.6, students: 15230, hours: 18, tags: ['JS','Frontend'], desc: 'Learn JavaScript with projects, ES6+, and tooling.' , date: '2025-09-12'},
  { id: 'c2', title: 'React + Vite Crash Course', category: 'Web Dev', level: 'Intermediate', price: 49, rating: 4.7, students: 8422, hours: 10, tags: ['React','Vite'], desc: 'Build fast frontends with React and Vite.' , date: '2025-07-08'},
  { id: 'c3', title: 'Tailwind CSS Mastery', category: 'Design', level: 'Beginner', price: 29, rating: 4.5, students: 6120, hours: 7, tags: ['CSS','UI'], desc: 'Design systems and components with Tailwind.' , date: '2025-10-01'},
  { id: 'c4', title: 'Python for Data Analysis', category: 'Data', level: 'Beginner', price: 59, rating: 4.8, students: 22041, hours: 24, tags: ['Pandas','Numpy'], desc: 'Analyze datasets and build insights in Python.' , date: '2025-06-11'},
  { id: 'c5', title: 'Machine Learning Essentials', category: 'AI/ML', level: 'Intermediate', price: 79, rating: 4.6, students: 13220, hours: 20, tags: ['ML','Scikit'], desc: 'Supervised learning, evaluation, and pipelines.' , date: '2025-08-20'},
  { id: 'c6', title: 'Deep Learning with PyTorch', category: 'AI/ML', level: 'Advanced', price: 119, rating: 4.7, students: 9210, hours: 28, tags: ['DL','PyTorch'], desc: 'Neural nets, CNNs, RNNs with PyTorch.' , date: '2025-09-25'},
  { id: 'c7', title: 'UX Design Foundations', category: 'Design', level: 'Beginner', price: 25, rating: 4.3, students: 4100, hours: 6, tags: ['UX','Research'], desc: 'Design thinking, user research, and prototyping.' , date: '2025-05-03'},
  { id: 'c8', title: 'Data Visualization with D3', category: 'Data', level: 'Advanced', price: 99, rating: 4.4, students: 3001, hours: 16, tags: ['D3','Charts'], desc: 'Interactive visualizations on the web.' , date: '2025-07-21'},
  { id: 'c9', title: 'Fullstack Basics (Node+DB)', category: 'Web Dev', level: 'Intermediate', price: 69, rating: 4.5, students: 7029, hours: 14, tags: ['Node','DB'], desc: 'REST APIs, auth, and persistence.' , date: '2025-04-01'}
];

const state = {
  query: '',
  category: 'all',
  level: 'All',
  priceMax: 200,
  ratingMin: 0,
  sort: 'relevance',
  compare: new Set(),
  wishlist: new Set(JSON.parse(localStorage.getItem('wishlist')||'[]')),
  saleApplied: false,
};

const fmt = {
  price: v => `$${v.toFixed(0)}`,
  rating: v => `${v.toFixed(1)}★`,
  num: v => v.toLocaleString(),
};

function hydrateSaved() {
  const theme = localStorage.getItem('theme');
  if (theme) document.documentElement.classList.toggle('dark', theme === 'dark');
}

function bindNavbar() {
  $('#mobile-menu-btn').addEventListener('click', ()=> {
    $('#mobile-menu').classList.toggle('hidden');
  });
  $('#theme-toggle').addEventListener('click', ()=> {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

function filterCourses() {
  let list = db.slice();
  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(c => c.title.toLowerCase().includes(q) || c.tags.join(' ').toLowerCase().includes(q));
  }
  if (state.category !== 'all') list = list.filter(c => c.category === state.category);
  if (state.level !== 'All') list = list.filter(c => c.level === state.level);
  list = list.filter(c => c.price <= state.priceMax && c.rating >= state.ratingMin);
  switch(state.sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating-desc': list.sort((a,b)=>b.rating-a.rating); break;
    case 'newest': list.sort((a,b)=> new Date(b.date)-new Date(a.date)); break;
    default: list.sort((a,b)=> b.rating*b.students - a.rating*a.students);
  }
  return list;
}

function courseCard(c){
  const inWish = state.wishlist.has(c.id);
  const inCompare = state.compare.has(c.id);
  const priceNow = effectivePrice(c.price);
  const priceHTML = (state.saleApplied && priceNow !== c.price)
    ? `<span class="font-semibold text-indigo-600 mr-2">${fmt.price(priceNow)}</span><span class="text-gray-500 line-through">${fmt.price(c.price)}</span>`
    : `<span class="font-semibold">${fmt.price(priceNow)}</span>`;
  return `
  <div class="card p-4 flex flex-col gap-3">
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="font-semibold leading-tight">${c.title}</h3>
        <div class="text-xs text-gray-600 dark:text-gray-300">${c.category} • ${c.level}</div>
      </div>
      <button class="icon-btn" data-qv="${c.id}">👁️</button>
    </div>
    <p class="text-sm text-gray-700 dark:text-gray-300">${c.desc}</p>
    <div class="flex items-center justify-between text-sm">
      ${priceHTML}
      <span>${fmt.rating(c.rating)} • ${fmt.num(c.students)} students</span>
    </div>
    <div class="flex items-center gap-2">
      <button class="btn btn-primary flex-1" data-buy="${c.id}">Enroll</button>
      <button class="icon-btn ${inWish? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}" data-wish="${c.id}" title="Wishlist">${inWish?'💜':'🤍'}</button>
      <button class="icon-btn ${inCompare? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}" data-compare="${c.id}" title="Compare">⚖️</button>
    </div>
  </div>`;
}

function render() {
  const list = filterCourses();
  $('#results-count').textContent = `${list.length} results`;
  $('#courses-grid').innerHTML = list.map(courseCard).join('');
  $('#compare-tray').classList.toggle('hidden', state.compare.size === 0);
  $('#clear-compare').classList.toggle('hidden', state.compare.size === 0);
  renderWishlist();
}

function renderWishlist(){
  const arr = db.filter(c=> state.wishlist.has(c.id));
  $('#wishlist').innerHTML = arr.length? arr.map(c=>`<div class="flex items-center justify-between gap-2"><span>${c.title}</span><button class="icon-btn" data-wish-remove="${c.id}">✕</button></div>`).join('') : '<div class="text-gray-500">No items</div>';
}

function bindFilters(){
  $('#search').addEventListener('input', e=> { state.query = e.target.value; render(); });
  $('#sort').addEventListener('change', e=> { state.sort = e.target.value; render(); });
  $('#filter-category').addEventListener('change', e=> { state.category = e.target.value; render(); });
  $$('#price-range').forEach(el=> el.addEventListener('input', e=> { state.priceMax = +e.target.value; $('#price-label').textContent = `Up to $${state.priceMax}`; }));
  $$('#rating-range').forEach(el=> el.addEventListener('input', e=> { state.ratingMin = +e.target.value; $('#rating-label').textContent = `${state.ratingMin}★ and up`; }));
  $('#apply-filters').addEventListener('click', ()=> render());
  $('#reset-filters').addEventListener('click', ()=> { state.query=''; $('#search').value=''; state.category='all'; $('#filter-category').value='all'; state.level='All'; $$('.chip').forEach(b=> b.classList.remove('chip-active')); $(`[data-level="All"]`).classList.add('chip-active'); state.priceMax=200; $('#price-range').value=200; $('#price-label').textContent='Up to $200'; state.ratingMin=0; $('#rating-range').value=0; $('#rating-label').textContent='0★ and up'; render(); });
  $$('.chip').forEach(btn=> btn.addEventListener('click', ()=> { $$('.chip').forEach(b=> b.classList.remove('chip-active')); btn.classList.add('chip-active'); state.level = btn.dataset.level; render(); }));
}

function bindGridActions(){
  $('#courses-grid').addEventListener('click', (e)=>{
    const t = e.target.closest('button'); if(!t) return;
    const id = t.dataset.buy || t.dataset.wish || t.dataset.compare || t.dataset.qv;
    const course = db.find(c=> c.id === id);
    if (t.dataset.buy){ alert(`Enrolled in ${course.title}!`); }
    if (t.dataset.wish){ state.wishlist.has(id)? state.wishlist.delete(id) : state.wishlist.add(id); localStorage.setItem('wishlist', JSON.stringify([...state.wishlist])); render(); }
    if (t.dataset.compare){ state.compare.has(id)? state.compare.delete(id) : state.compare.add(id); renderCompareTray(); render(); }
    if (t.dataset.qv){ openQuickView(course); }
  });
  $('#clear-compare').addEventListener('click', ()=> { state.compare.clear(); renderCompareTray(); render(); });
}

function renderCompareTray(){
  const items = db.filter(c=> state.compare.has(c.id));
  $('#compare-items').innerHTML = items.map(c=> `<span class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">${c.title}</span>`).join('');
}

function bindCompare(){
  $('#open-compare').addEventListener('click', ()=> openCompare());
  $('#close-compare').addEventListener('click', ()=> $('#compare-modal').classList.add('hidden'));
}

function openCompare(){
  const items = db.filter(c=> state.compare.has(c.id));
  $('#compare-table').innerHTML = items.map(c=> `
    <div class="card p-4 space-y-2">
      <div class="font-semibold">${c.title}</div>
      <div class="text-sm">${c.category} • ${c.level}</div>
      <div class="text-sm">${fmt.price(c.price)} • ${fmt.rating(c.rating)}</div>
      <div class="text-sm">${fmt.num(c.students)} students</div>
      <div class="text-sm">${c.hours} hours</div>
    </div>`).join('');
  $('#compare-modal').classList.remove('hidden');
}

function openQuickView(c){
  $('#qv-title').textContent = c.title;
  $('#qv-desc').textContent = c.desc;
  $('#qv-meta').innerHTML = `${c.category} • ${c.level} • ${fmt.price(c.price)} • ${fmt.rating(c.rating)} • ${c.hours}h`;
  $('#quickview-modal').classList.remove('hidden');
}

function bindQuickView(){
  $('#qv-close').addEventListener('click', ()=> $('#quickview-modal').classList.add('hidden'));
}

function salePopup(){
  const dismissed = localStorage.getItem('sale_dismissed')==='1';
  if (!dismissed) { $('#sale-popup').classList.remove('hidden'); $('#sale-popup').classList.add('flex'); }
  $('#close-sale').addEventListener('click', ()=> { if($('#dont-show').checked) localStorage.setItem('sale_dismissed','1'); $('#sale-popup').classList.add('hidden'); });
  $('#apply-sale').addEventListener('click', ()=> { state.saleApplied = true; alert('Code LIGHT60 applied! Prices updated.'); $('#sale-popup').classList.add('hidden'); render(); });
}

function effectivePrice(p){
  return state.saleApplied ? Math.max(5, Math.round(p*0.4)) : p;
}

function chatbot(){
  const toggle = $('#chat-toggle');
  const win = $('#chat-window');
  const log = $('#chat-log');
  const form = $('#chat-form');
  const input = $('#chat-input');
  $('#chat-close').addEventListener('click', ()=> win.classList.add('hidden'));
  toggle.addEventListener('click', ()=> { win.classList.toggle('hidden'); if(!win.classList.contains('hidden')) input.focus(); });

  function addMsg(text, from='bot'){
    const div = document.createElement('div');
    div.className = `px-3 py-2 rounded-lg text-sm ${from==='bot'?'bg-gray-100 dark:bg-gray-700 self-start':'bg-indigo-600 text-white self-end'}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  addMsg('Hi! Ask me to recommend a course by category, level, or budget.');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = input.value.trim();
    if(!q) return;
    addMsg(q, 'user');
    input.value='';
    setTimeout(()=> {
      addMsg(reply(q));
    }, 300);
  });

  function reply(q){
    const s = q.toLowerCase();
    const budget = /under\s*(\d+)/.exec(s);
    const cat = ['web dev','data','design','ai/ml','ai','ml'].find(k=> s.includes(k));
    const lvl = ['beginner','intermediate','advanced'].find(k=> s.includes(k));
    let list = db.slice();
    if (cat){
      const map = { 'ai/ml':'AI/ML', 'ai':'AI/ML', 'ml':'AI/ML' };
      const catLabel = map[cat] || cat.replace(/\b\w/g, m=> m.toUpperCase());
      list = list.filter(c=> c.category === catLabel);
    }
    if (lvl){
      const L = lvl.replace(/\b\w/g, m=> m.toUpperCase());
      list = list.filter(c=> c.level === L);
    }
    if (budget){
      const b = +budget[1];
      list = list.filter(c=> effectivePrice(c.price) <= b);
    }
    if (!list.length) return 'I could not find a match. Try different category or budget.';
    list.sort((a,b)=> b.rating - a.rating);
    const top = list.slice(0,3).map(c=> `${c.title} (${fmt.price(effectivePrice(c.price))}, ${fmt.rating(c.rating)})`).join('; ');
    return `Top picks: ${top}`;
  }
}

function init(){
  hydrateSaved();
  bindNavbar();
  bindFilters();
  bindGridActions();
  bindCompare();
  bindQuickView();
  render();
  renderCompareTray();
  salePopup();
  chatbot();
}

init();
