const $=s=>document.querySelector(s);
let questions=[],deck='all',pool=[],index=0,answers=load('ee_answers',{}),bookmarks=load('ee_bookmarks',[]),theme=load('ee_theme','system');
const letters=['A','B','C','D'];
function load(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function cleanDeck(s){return s.replace('EE Board - ','')}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function decks(){return [...new Set(questions.map(q=>q.deck))]}
function filtered(){return questions.filter(q=>deck==='all'||q.deck===deck)}
function current(){return pool[index]}
function applyTheme(){let t=theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;document.documentElement.dataset.theme=t;$('#themeBtn').textContent=t==='dark'?'☼':'◐'}
function updateStats(){let vals=Object.values(answers),correct=vals.filter(x=>x.correct).length,done=vals.length,acc=done?Math.round(correct/done*100):0;$('#answeredCount').textContent=done;$('#correctCount').textContent=correct;$('#accuracyCount').textContent=acc+'%';$('#totalCount').textContent=questions.length}
function buildDeckMenus(){for(let id of ['deckSelect','browseDeck'])decks().forEach(d=>{let o=document.createElement('option');o.value=d;o.textContent=cleanDeck(d);$( '#'+id).append(o)})}
function setPool(reset=true){pool=filtered();if(reset)index=0;if(index>=pool.length)index=0;renderQuestion()}
function renderQuestion(){let q=current();if(!q){$('#questionText').textContent='No questions found.';$('#options').innerHTML='';$('#position').textContent='0 questions';return}
$('#position').textContent=`Question ${index+1} of ${pool.length}`;$('#deckBadge').textContent=cleanDeck(q.deck);$('#questionText').innerHTML=q.question;
$('#bookmarkBtn').textContent=bookmarks.includes(q.id)?'★ Saved':'☆ Save';$('#bookmarkBtn').classList.toggle('saved',bookmarks.includes(q.id));
let prior=answers[q.id];$('#options').innerHTML=q.options.map((opt,i)=>{let right=q.answer===letters[i],chosen=prior?.choice===letters[i];let cls=prior?(right?'correct':chosen?'incorrect':'') : '';return `<button class="option ${cls}" data-choice="${letters[i]}" ${prior?'disabled':''}><span class="option-letter">${letters[i]}</span><span>${opt}</span></button>`}).join('');
document.querySelectorAll('.option').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.choice)));
let fb=$('#feedback');if(prior){fb.className='feedback'+(prior.correct?'':' wrong');fb.innerHTML=`<strong>${prior.correct?'✓ Correct!':'✕ Not quite.'} Correct answer: ${q.answer}</strong>${q.note?`<div>${q.note}</div>`:''}${q.why?`<div class="why-label">Why</div><div>${q.why}</div>`:''}`}else{fb.className='feedback hidden';fb.innerHTML=''}
$('#prevBtn').disabled=index===0;$('#prevBtn').style.opacity=index===0?'.45':'1';$('#nextBtn').textContent=index===pool.length-1?'Finish / Restart ↻':'Next question →'}
function choose(choice){let q=current();if(answers[q.id])return;answers[q.id]={choice,correct:choice===q.answer,at:Date.now()};save('ee_answers',answers);renderQuestion();updateStats()}
function goNext(){if(index<pool.length-1)index++;else index=0;renderQuestion()}
function showView(v){document.querySelectorAll('.view').forEach(x=>x.classList.add('hidden'));$('#'+v+'View').classList.remove('hidden');document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===v));if(v==='browse')renderList();if(v==='progress')renderProgress()}
function renderList(){let qlist=questions,term=$('#searchInput').value.toLowerCase(),d=$('#browseDeck').value;if(d!=='all')qlist=qlist.filter(q=>q.deck===d);if(term)qlist=qlist.filter(q=>(q.question+' '+q.why+' '+q.note).toLowerCase().includes(term));$('#questionList').innerHTML=qlist.map((q,i)=>`<div class="list-item" data-id="${q.id}"><span class="list-number">${i+1}</span><span class="list-copy"><strong>${q.question.replace(/<[^>]*>/g,' ')}</strong><small>${cleanDeck(q.deck)}</small></span><span class="list-status">${answers[q.id]?(answers[q.id].correct?'Correct':'Reviewed'):'Unanswered'}</span></div>`).join('')||'<p class="muted">No matching questions.</p>';document.querySelectorAll('.list-item').forEach(el=>el.addEventListener('click',()=>{let qid=el.dataset.id;deck=$('#browseDeck').value;pool=filtered();index=Math.max(0,pool.findIndex(q=>q.id===qid));$('#deckSelect').value=deck;showView('practice');renderQuestion()}))}
function renderProgress(){let vals=Object.values(answers),correct=vals.filter(x=>x.correct).length,done=vals.length,acc=done?Math.round(correct/done*100):0,pct=questions.length?Math.round(done/questions.length*100):0;$('#bigAccuracy').textContent=acc+'%';$('#ringLabel').textContent=pct+'%';$('#progressRing').style.background=`conic-gradient(var(--blue) ${pct*3.6}deg,var(--line) 0deg)`;$('#progressFill').style.width=pct+'%';$('#progressMessage').textContent=`${done} of ${questions.length} questions answered · ${correct} correct`;$('#deckProgress').innerHTML=decks().map(d=>{let qs=questions.filter(q=>q.deck===d),a=qs.filter(q=>answers[q.id]),c=a.filter(q=>answers[q.id].correct).length,p=a.length?Math.round(a.length/qs.length*100):0;return `<div class="deck-row"><div class="deck-row-top"><span>${cleanDeck(d)}</span><small>${a.length}/${qs.length} answered · ${c} correct</small></div><div class="progress-bar"><span style="width:${p}%"></span></div></div>`}).join('')}
$('#themeBtn').addEventListener('click',()=>{theme=theme==='dark'?'light':theme==='light'?'system':'dark';save('ee_theme',theme);applyTheme()});
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$('#deckSelect').addEventListener('change',e=>{deck=e.target.value;setPool()});
$('#browseDeck').addEventListener('change',renderList);$('#searchInput').addEventListener('input',renderList);
$('#prevBtn').addEventListener('click',()=>{if(index>0){index--;renderQuestion()}});
$('#nextBtn').addEventListener('click',goNext);
$('#shuffleBtn').addEventListener('click',()=>{pool=filtered().slice().sort(()=>Math.random()-.5);index=0;renderQuestion()});
$('#bookmarkBtn').addEventListener('click',()=>{let id=current().id;bookmarks=bookmarks.includes(id)?bookmarks.filter(x=>x!==id):[...bookmarks,id];save('ee_bookmarks',bookmarks);renderQuestion()});
$('#resetBtn').addEventListener('click',()=>{if(confirm('Reset all answered-question progress on this device? Bookmarks will be kept.')){answers={};save('ee_answers',answers);updateStats();renderProgress();renderQuestion()}});
async function init(){let r=await fetch('data/questions.json');questions=await r.json();buildDeckMenus();$('#totalCount').textContent=questions.length;setPool();updateStats();applyTheme();if('serviceWorker'in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('sw.js').catch(()=>{})}}
init();
