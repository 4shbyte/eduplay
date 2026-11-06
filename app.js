const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const state = {
  name: localStorage.getItem("eduplay_name") || "",
  score: Number(localStorage.getItem("eduplay_score") || 0),
  game: null
};

const categories = [
  {icon:"🔬",name:"Sains",desc:"Kenali alam dan cara kerja dunia.",color:"#e6f7ef"},
  {icon:"🌏",name:"Geografi",desc:"Jelajahi negara dan tempat menarik.",color:"#e6f2ff"},
  {icon:"📜",name:"Sejarah",desc:"Kenali peristiwa dan tokoh penting.",color:"#fff2dc"},
  {icon:"💻",name:"Teknologi",desc:"Pelajari teknologi di sekitar kita.",color:"#f0eaff"},
  {icon:"✨",name:"Pengetahuan Umum",desc:"Temukan fakta unik setiap hari.",color:"#ffeaf2"}
];
const materials = [
 {id:1,cat:"Sains",icon:"🪐",title:"Mengenal Tata Surya",desc:"Kenali Matahari dan planet-planet yang mengitarinya.",body:"Tata Surya adalah kumpulan benda langit dengan Matahari sebagai pusatnya. Ada delapan planet yang mengelilingi Matahari, yaitu Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus.",fact:"Jupiter adalah planet terbesar di Tata Surya."},
 {id:2,cat:"Sains",icon:"🫀",title:"Mengenal Organ Tubuh",desc:"Tubuh manusia memiliki organ dengan fungsi berbeda.",body:"Tubuh manusia memiliki berbagai organ. Jantung memompa darah, paru-paru membantu proses pernapasan, dan otak mengatur banyak aktivitas tubuh.",fact:"Jantung bekerja memompa darah ke seluruh tubuh."},
 {id:3,cat:"Geografi",icon:"🌍",title:"Benua di Dunia",desc:"Pelajari pembagian wilayah daratan di Bumi.",body:"Secara umum, dunia dibagi menjadi tujuh benua: Asia, Afrika, Amerika Utara, Amerika Selatan, Antarktika, Eropa, dan Australia.",fact:"Asia adalah benua dengan jumlah penduduk terbanyak."},
 {id:4,cat:"Sejarah",icon:"🇮🇩",title:"Proklamasi Indonesia",desc:"Mengenal peristiwa penting pada 17 Agustus 1945.",body:"Indonesia memproklamasikan kemerdekaan pada 17 Agustus 1945. Proklamasi dibacakan oleh Soekarno didampingi Mohammad Hatta di Jakarta.",fact:"Naskah proklamasi diketik oleh Sayuti Melik."},
 {id:5,cat:"Teknologi",icon:"🌐",title:"Apa Itu Internet?",desc:"Kenali jaringan yang menghubungkan perangkat di dunia.",body:"Internet adalah jaringan komputer global yang memungkinkan perangkat saling bertukar informasi. Internet digunakan untuk belajar, berkomunikasi, mencari informasi, dan banyak hal lainnya.",fact:"World Wide Web dan internet adalah dua hal yang berbeda."},
 {id:6,cat:"Pengetahuan Umum",icon:"🐙",title:"Fakta Unik Hewan",desc:"Temukan fakta menarik dari dunia hewan.",body:"Hewan memiliki kemampuan yang beragam. Gurita memiliki tiga jantung, gajah menggunakan belalainya untuk mengambil makanan dan air, sedangkan kelelawar menggunakan ekolokasi untuk membantu navigasi.",fact:"Gurita memiliki tiga jantung."}
];

function updateScore(){
  $("#navScore").textContent=state.score;
  $("#profileScore").textContent=state.score+" ⭐";
  $("#playerName").value=state.name;
  localStorage.setItem("eduplay_score",state.score);
}
function addPoints(n){state.score+=n;updateScore();}
function showPage(page){
  $$(".page-section").forEach(el=>el.classList.add("d-none"));
  const target=$("#"+page+"Page"); if(target) target.classList.remove("d-none");
  $$(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===page));
  $("#gameArea").classList.add("d-none");
  $("#materialDetail").classList.add("d-none");
  const menu=$("#navMenu"); if(menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
  const pageLink=e.target.closest("[data-page]");
  const go=e.target.closest("[data-go]");
  if(pageLink){e.preventDefault();showPage(pageLink.dataset.page);}
  if(go)showPage(go.dataset.go);
});
function renderCategories(){
  $("#homeCategories").innerHTML=categories.slice(0,4).map(c=>`<div class="col-6 col-lg-3"><div class="category-card"><div class="category-icon" style="background:${c.color}">${c.icon}</div><h3>${c.name}</h3><p>${c.desc}</p></div></div>`).join("");
}
function renderMaterials(){
  $("#materialsList").innerHTML=materials.map(m=>`<div class="col-md-6 col-lg-4"><article class="material-card" data-material="${m.id}"><div class="material-emoji">${m.icon}</div><span class="eyebrow">${m.cat}</span><h3 class="mt-2">${m.title}</h3><p>${m.desc}</p></article></div>`).join("");
  $$(".material-card").forEach(card=>card.addEventListener("click",()=>openMaterial(Number(card.dataset.material))));
}
function openMaterial(id){
  const m=materials.find(x=>x.id===id);
  $("#materialDetail").classList.remove("d-none");
  $("#materialDetail").innerHTML=`<button class="btn btn-sm btn-outline-primary mb-3" id="backMaterials">← Kembali ke materi</button><div class="material-emoji">${m.icon}</div><span class="eyebrow">${m.cat}</span><h2 class="mt-2">${m.title}</h2><p class="mt-3">${m.body}</p><div class="fact-box">💡 <strong>Fakta menarik:</strong> ${m.fact}</div><button class="btn btn-primary" data-go="games">Uji Pengetahuanmu</button>`;
  $("#backMaterials").addEventListener("click",()=>$("#materialDetail").classList.add("d-none"));
  $("#materialDetail").scrollIntoView({behavior:"smooth",block:"start"});
}
function gameHeader(title,desc){return `<button class="btn btn-sm btn-outline-primary mb-3" id="backGames">← Semua permainan</button><h2>${title}</h2><p class="text-muted">${desc}</p><div id="gameContent"></div>`;}
function showGame(name){
  state.game=name;$("#gameArea").classList.remove("d-none");
  const titles={quiz:["Quiz Challenge","Pilih jawaban yang paling tepat."],guess:["Tebak Kata","Baca petunjuk dan masukkan jawaban."],match:["Cocokkan Pasangan","Pilih dua kartu yang saling berhubungan."],scramble:["Susun Kata","Susun huruf acak menjadi kata yang benar."]};
  $("#gameArea").innerHTML=gameHeader(...titles[name]);
  $("#backGames").addEventListener("click",()=>$("#gameArea").classList.add("d-none"));
  ({quiz:playQuiz,guess:playGuess,match:playMatch,scramble:playScramble})[name]();
  $("#gameArea").scrollIntoView({behavior:"smooth",block:"start"});
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-game]");if(b)showGame(b.dataset.game);});

const quizQuestions=[
 {q:"Planet terbesar di Tata Surya adalah ...",opts:["Bumi","Mars","Jupiter","Venus"],a:"Jupiter",why:"Jupiter adalah planet terbesar di Tata Surya."},
 {q:"Apa ibu kota Indonesia?",opts:["Bandung","Jakarta","Surabaya","Medan"],a:"Jakarta",why:"Jakarta dikenal sebagai ibu kota Indonesia."},
 {q:"Organ yang memompa darah adalah ...",opts:["Paru-paru","Hati","Jantung","Ginjal"],a:"Jantung",why:"Jantung memompa darah ke seluruh tubuh."},
 {q:"Perangkat untuk mengetik pada komputer adalah ...",opts:["Monitor","Keyboard","Speaker","Printer"],a:"Keyboard",why:"Keyboard digunakan untuk memasukkan teks dan perintah."}
];
function playQuiz(){
 let i=0,correct=0;
 function render(){
  const q=quizQuestions[i];
  $("#gameContent").innerHTML=`<div class="d-flex justify-content-between mb-3"><strong>Pertanyaan ${i+1}/${quizQuestions.length}</strong><strong>Benar: ${correct}</strong></div><div class="progress mb-4" style="height:8px"><div class="progress-bar" style="width:${(i/quizQuestions.length)*100}%;background:#7256d8"></div></div><h4 class="fw-bold">${q.q}</h4><div>${q.opts.map(o=>`<button class="answer-option" data-answer="${o}">${o}</button>`).join("")}</div><div id="quizFeedback" class="feedback"></div><button id="nextQuiz" class="btn btn-primary mt-3 d-none">${i===quizQuestions.length-1?"Selesaikan":"Pertanyaan berikutnya"}</button>`;
  let answered=false;
  $$(".answer-option").forEach(b=>b.addEventListener("click",()=>{
   if(answered)return;answered=true;
   const ok=b.dataset.answer===q.a;if(ok)correct++;
   $$(".answer-option").forEach(x=>{x.disabled=true;if(x.dataset.answer===q.a)x.classList.add("selected");});
   $("#quizFeedback").textContent=(ok?"Benar! 🎉 ":"Belum tepat. ")+q.why;
   $("#quizFeedback").style.color=ok?"#218653":"#bd5a50";
   $("#nextQuiz").classList.remove("d-none");
  }));
  $("#nextQuiz").addEventListener("click",()=>{
   if(i<quizQuestions.length-1){i++;render();}
   else finishGame(correct*10,`Kamu menjawab benar ${correct} dari ${quizQuestions.length} pertanyaan.`);
  });
 }
 render();
}
const guessItems=[
 {hint:"Aku adalah planet bercincin yang terkenal.",answer:"SATURNUS"},
 {hint:"Aku adalah bintang yang menjadi pusat Tata Surya.",answer:"MATAHARI"},
 {hint:"Aku adalah alat untuk mengetik pada komputer.",answer:"KEYBOARD"}
];
function playGuess(){
 let i=0,correct=0;
 function render(){
  const item=guessItems[i];
  $("#gameContent").innerHTML=`<p><strong>Tantangan ${i+1}/${guessItems.length}</strong></p><div class="fact-box fs-5">💡 ${item.hint}</div><label class="form-label fw-bold" for="guessInput">Jawabanmu</label><input id="guessInput" class="form-control" placeholder="Ketik jawaban..." autocomplete="off"><div id="guessFeedback" class="feedback"></div><button id="checkGuess" class="btn btn-primary mt-3">Periksa Jawaban</button><button id="nextGuess" class="btn btn-outline-primary mt-3 ms-2 d-none">Lanjut</button>`;
  $("#checkGuess").addEventListener("click",()=>{
   const val=$("#guessInput").value.trim().toUpperCase();
   if(!val){$("#guessFeedback").textContent="Isi jawaban terlebih dahulu.";return;}
   const ok=val===item.answer;if(ok)correct++;
   $("#guessFeedback").textContent=ok?"Tepat sekali! 🎉":`Belum tepat. Jawabannya: ${item.answer}`;
   $("#guessFeedback").style.color=ok?"#218653":"#bd5a50";
   $("#checkGuess").disabled=true;$("#nextGuess").classList.remove("d-none");
  });
  $("#nextGuess").addEventListener("click",()=>{if(i<guessItems.length-1){i++;render();}else finishGame(correct*10,`Kamu berhasil menebak ${correct} dari ${guessItems.length} kata.`);});
 }
 render();
}
const matchPairs=[["Jakarta","Ibu kota Indonesia"],["Matahari","Pusat Tata Surya"],["H2O","Air"],["Keyboard","Alat untuk mengetik"]];
function playMatch(){
 let selected=[],matched=[],moves=0;
 const cards=matchPairs.flatMap((p,i)=>[{id:i,side:0,text:p[0]},{id:i,side:1,text:p[1]}]).sort(()=>Math.random()-.5);
 $("#gameContent").innerHTML=`<p class="text-muted">Pilih satu kartu istilah, lalu pilih kartu pasangannya.</p><div class="pair-grid" id="pairGrid">${cards.map((c,i)=>`<button class="pair-card" data-index="${i}">${c.text}</button>`).join("")}</div><div id="pairFeedback" class="feedback"></div>`;
 $$(".pair-card").forEach(btn=>btn.addEventListener("click",()=>{
  const idx=Number(btn.dataset.index),card=cards[idx];
  if(matched.includes(card.id)||selected.some(x=>x.idx===idx)||selected.length===2)return;
  btn.classList.add("selected");selected.push({idx,id:card.id,side:card.side}); 
  if(selected.length===2){
   moves++;
   const [a,b]=selected;
   if(a.id===b.id&&a.side!==b.side){
    matched.push(a.id);
    [a.idx,b.idx].forEach(n=>{$(`[data-index="${n}"]`).classList.remove("selected");$(`[data-index="${n}"]`).classList.add("done");$(`[data-index="${n}"]`).disabled=true;});
    $("#pairFeedback").textContent=`Pasangan cocok! (${matched.length}/${matchPairs.length})`;
    selected=[];
    if(matched.length===matchPairs.length)setTimeout(()=>finishGame(Math.max(5,40-(moves-matchPairs.length)*5),`Semua pasangan berhasil ditemukan dalam ${moves} langkah.`),500);
   }else{
    $("#pairFeedback").textContent="Belum cocok. Coba pasangan lain.";
    setTimeout(()=>{selected.forEach(x=>$(`[data-index="${x.idx}"]`).classList.remove("selected"));selected=[];},700);
   }
  }
 }));
}
const scrambleWords=[{word:"PLANET",hint:"Benda langit yang mengelilingi bintang."},{word:"KOMPUTER",hint:"Perangkat elektronik untuk mengolah data."},{word:"SEJARAH",hint:"Ilmu yang mempelajari peristiwa masa lalu."}];
function playScramble(){
 let i=0,correct=0,chosen=[];
 function render(){
  const item=scrambleWords[i],letters=item.word.split("").map((l,n)=>({l,n})).sort(()=>Math.random()-.5);
  chosen=[];
  $("#gameContent").innerHTML=`<p><strong>Kata ${i+1}/${scrambleWords.length}</strong></p><div class="fact-box">💡 ${item.hint}</div><p class="fw-bold mb-1">Huruf yang tersedia:</p><div class="letter-row" id="letterBank">${letters.map((x,n)=>`<button class="letter" data-letter="${n}">${x.l}</button>`).join("")}</div><p class="fw-bold mb-1">Susunan jawaban:</p><div class="letter-row" id="answerBank"><span class="text-muted small">Pilih huruf di atas.</span></div><button id="clearLetters" class="btn btn-outline-secondary btn-sm">Ulangi</button> <button id="checkWord" class="btn btn-primary btn-sm">Periksa</button><div id="scrambleFeedback" class="feedback"></div><button id="nextWord" class="btn btn-outline-primary mt-3 d-none">Lanjut</button>`;
  $$(".letter").forEach(btn=>btn.addEventListener("click",()=>{
   if(btn.disabled)return;btn.disabled=true;chosen.push({letter:letters[Number(btn.dataset.letter)].l,index:Number(btn.dataset.letter)});
   drawAnswer();
  }));
  function drawAnswer(){$("#answerBank").innerHTML=chosen.length?chosen.map(x=>`<span class="letter">${x.letter}</span>`).join(""):'<span class="text-muted small">Pilih huruf di atas.</span>';}
  $("#clearLetters").addEventListener("click",()=>{chosen=[];$$(".letter").forEach(b=>b.disabled=false);drawAnswer();$("#scrambleFeedback").textContent="";});
  $("#checkWord").addEventListener("click",()=>{
   const val=chosen.map(x=>x.letter).join("");
   if(!val){$("#scrambleFeedback").textContent="Pilih huruf terlebih dahulu.";return;}
   const ok=val===item.word; if(ok)correct++;
   $("#scrambleFeedback").textContent=ok?"Benar! 🎉":`Belum tepat. Jawabannya: ${item.word}`;
   $("#scrambleFeedback").style.color=ok?"#218653":"#bd5a50";
   $("#checkWord").disabled=true;$("#nextWord").classList.remove("d-none");
  });
  $("#nextWord").addEventListener("click",()=>{if(i<scrambleWords.length-1){i++;render();}else finishGame(correct*10,`Kamu menyusun ${correct} dari ${scrambleWords.length} kata dengan benar.`);});
 }
 render();
}
function finishGame(points,message){
 addPoints(points);
 $("#gameContent").innerHTML=`<div class="text-center py-3"><div style="font-size:3.5rem">🏆</div><h2 class="mt-2">Permainan selesai!</h2><p class="text-muted">${message}</p><div class="fact-box d-inline-block"><strong>+${points} poin</strong> ⭐</div><div class="d-flex justify-content-center flex-wrap gap-2 mt-3"><button class="btn btn-primary" id="playAgain">Main Lagi</button><button class="btn btn-outline-primary" id="backToGames">Pilih Game Lain</button></div></div>`;
 $("#playAgain").addEventListener("click",()=>showGame(state.game));
 $("#backToGames").addEventListener("click",()=>{$("#gameArea").classList.add("d-none");});
}
$("#saveName").addEventListener("click",()=>{
 const value=$("#playerName").value.trim();
 if(!value){alert("Masukkan nama panggilan terlebih dahulu.");return;}
 state.name=value;localStorage.setItem("eduplay_name",value);alert("Nama berhasil disimpan!");
});
$("#resetScore").addEventListener("click",()=>{
 if(confirm("Yakin ingin mengatur ulang semua poin?")){state.score=0;updateScore();}
});
renderCategories();renderMaterials();updateScore();
