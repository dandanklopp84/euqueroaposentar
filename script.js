// Combinações C(n,k)
function C(n,k){ if(k<0||k>n) return 0; if(k===0||k===n) return 1; let res=1; for(let i=1;i<=k;i++){ res = res*(n - (k - i))/i; } return Math.round(res); }

function sanitizeInput(v){ v = (v||'').replace(/[^0-9]/g,''); if(v.length===1) return v; if(v.length>=2) return v.slice(0,2); return ''; }
function getDrawn(){ const inputs = Array.from(document.querySelectorAll('.ball')); const nums = new Set(); for(const el of inputs){ const v = el.value.trim(); if(!v) continue; const n = parseInt(v,10); if(!Number.isFinite(n)) continue; if(n<1||n>60) continue; nums.add(n); } const arr = Array.from(nums); arr.sort((a,b)=>a-b); return arr; }

function compute(game, drawn){ const chosen = game.numbers; const m = chosen.filter(x=>drawn.includes(x)).length; const n = chosen.length; const senas = C(m,6); const quinas = C(m,5)*C(n-m,1); const quadras = C(m,4)*C(n-m,2); return { m, n, senas, quinas, quadras } }

function renderSummary(drawn){ const total = { jogos: GAMES_DATA.games.length, quadras:0, quinas:0, senas:0 };
 for(const g of GAMES_DATA.games){ const r = compute(g, drawn); total.quadras += r.quadras; total.quinas += r.quinas; total.senas += r.senas; }
 const cards = document.getElementById('summaryCards'); cards.innerHTML = '';
 const items = [
   { title:'Jogos', value: total.jogos },
   { title:'Quadras', value: total.quadras },
   { title:'Quinas', value: total.quinas },
   { title:'Senas', value: total.senas }
 ];
 for(const it of items){ const card = document.createElement('div'); card.className = 'card'; const h3 = document.createElement('h3'); h3.textContent = it.title; const p = document.createElement('p'); p.textContent = it.value; card.appendChild(h3); card.appendChild(p); cards.appendChild(card); }
}

function renderResults(drawn){ const container = document.getElementById('results'); container.innerHTML = '';
 let rows = GAMES_DATA.games.map(g=>{ const r = compute(g, drawn); return { game:g, r }; });
 // Ordenar: mais acertos (desc) -> maior tamanho do jogo (desc) -> id (asc)
 rows.sort((a,b)=> b.r.m - a.r.m || b.game.numbers.length - a.game.numbers.length || a.game.id.localeCompare(b.game.id));
 for(const row of rows){ const el = document.createElement('div'); el.className = 'row';
   const id = document.createElement('div'); id.innerHTML = `<span class="badge">🎯</span>`;
   const nums = document.createElement('div'); nums.className = 'nums';
   for(const n of row.game.numbers){ const chip = document.createElement('div'); chip.className = 'num' + (drawn.includes(n)?' hit':''); chip.textContent = String(n).padStart(2,'0'); nums.appendChild(chip); }
   const stats = document.createElement('div'); stats.className = 'stats'; stats.innerHTML = `<span class="badge">${row.r.m} acertos</span>`;
   const counts = document.createElement('div'); counts.className = 'counts';
   const makeCount = (label, value)=>{ const wrap = document.createElement('div'); wrap.className = 'count'; const lb = document.createElement('label'); lb.textContent = label; const val = document.createElement('span'); val.className = 'value'; val.textContent = value; wrap.appendChild(lb); wrap.appendChild(val); return wrap; };
   counts.appendChild(makeCount('Quadras', row.r.quadras));
   counts.appendChild(makeCount('Quinas', row.r.quinas));
   counts.appendChild(makeCount('Senas', row.r.senas));
   el.appendChild(id); el.appendChild(nums); el.appendChild(stats); el.appendChild(counts);
   container.appendChild(el);
 }
}

function initInputs(){ const inputs = Array.from(document.querySelectorAll('.ball'));
 inputs.forEach((el, idx)=>{ el.addEventListener('input', ()=>{ el.value = sanitizeInput(el.value); if(el.value.length===2 && idx < inputs.length-1){ inputs[idx+1].focus(); } }); });
 document.getElementById('btnClear').addEventListener('click', ()=>{ inputs.forEach(el=>el.value=''); renderSummary([]); renderResults([]); });
 document.getElementById('btnCheck').addEventListener('click', ()=>{ const drawn = getDrawn(); renderSummary(drawn); renderResults(drawn); });
}

function init(){ initInputs(); renderSummary([]); renderResults([]); }

window.addEventListener('load', init);
