
// ==========================================
// EDUPLAY - PERSONALITY & SKILL DISCOVERY
// ==========================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
  name: localStorage.getItem("eduplay_name") || "",
  personalityResult: JSON.parse(
    localStorage.getItem("eduplay_personality") || "null"
  ),
  careerResult: JSON.parse(
    localStorage.getItem("eduplay_career") || "null"
};


// ==========================================
// 1. NAVIGASI HALAMAN
// ==========================================

function showPage(page) {
  $$(".page-section").forEach(section => {
    section.classList.add("d-none");
  });

  const target = $("#" + page + "Page");

  if (target) {
    target.classList.remove("d-none");
  }

  $$(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  const menu = $("#navMenu");

  if (menu && menu.classList.contains("show")) {
    bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }

  if (page === "profile") {
    renderProfile();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document.addEventListener("click", event => {
  const pageLink = event.target.closest("[data-page]");
  const goButton = event.target.closest("[data-go]");

  if (pageLink) {
    event.preventDefault();
    showPage(pageLink.dataset.page);
  }

  if (goButton) {
    showPage(goButton.dataset.go);
  }
});


// ==========================================
// 2. DATA PERSONALITY DISCOVERY
// ==========================================

const personalityQuestions = [
  {
    question: "Ketika memiliki waktu luang, apa yang paling ingin kamu lakukan?",
    options: [
      {
        text: "Membuat sesuatu, menggambar, atau mencoba ide baru.",
        type: "creative"
      },
      {
        text: "Mencari informasi atau mempelajari hal menarik.",
        type: "analytical"
      },
      {
        text: "Bertemu teman dan melakukan kegiatan bersama.",
        type: "social"
      },
      {
        text: "Menyusun rencana atau mengatur kegiatan.",
        type: "organized"
      }
    ]
  },

  {
    question: "Jika mendapatkan tugas kelompok, peran apa yang biasanya kamu pilih?",
    options: [
      {
        text: "Memberikan ide dan membuat konsep.",
        type: "creative"
      },
      {
        text: "Menganalisis informasi dan mencari solusi.",
        type: "analytical"
      },
      {
        text: "Berkomunikasi dan membantu anggota kelompok.",
        type: "social"
      },
      {
        text: "Membagi tugas dan mengatur jadwal.",
        type: "organized"
      }
    ]
  },

  {
    question: "Hal apa yang paling membuatmu tertarik?",
    options: [
      {
        text: "Seni, desain, musik, dan hal-hal kreatif.",
        type: "creative"
      },
      {
        text: "Teknologi, fakta, dan teka-teki.",
        type: "analytical"
      },
      {
        text: "Hubungan antarmanusia dan kegiatan sosial.",
        type: "social"
      },
      {
        text: "Perencanaan, target, dan pengelolaan.",
        type: "organized"
      }
    ]
  },

  {
    question: "Ketika menghadapi masalah, apa yang biasanya kamu lakukan?",
    options: [
      {
        text: "Mencoba mencari cara yang berbeda.",
        type: "creative"
      },
      {
        text: "Mencari penyebab dan mempertimbangkan solusi.",
        type: "analytical"
      },
      {
        text: "Bertanya atau berdiskusi dengan orang lain.",
        type: "social"
      },
      {
        text: "Membuat langkah-langkah penyelesaian.",
        type: "organized"
      }
    ]
  },

  {
    question: "Lingkungan seperti apa yang paling kamu sukai?",
    options: [
      {
        text: "Lingkungan yang bebas untuk bereksperimen.",
        type: "creative"
      },
      {
        text: "Lingkungan yang menantang untuk berpikir.",
        type: "analytical"
      },
      {
        text: "Lingkungan yang ramai dan banyak interaksi.",
        type: "social"
      },
      {
        text: "Lingkungan yang teratur dan terencana.",
        type: "organized"
      }
    ]
  },

  {
    question: "Jika mengikuti sebuah kegiatan baru, apa yang paling ingin kamu coba?",
    options: [
      {
        text: "Membuat karya atau proyek kreatif.",
        type: "creative"
      },
      {
        text: "Mencoba eksperimen atau tantangan logika.",
        type: "analytical"
      },
      {
        text: "Menjadi bagian dari kegiatan bersama.",
        type: "social"
      },
      {
        text: "Mengatur jalannya kegiatan.",
        type: "organized"
      }
    ]
  }
];

const personalityTypes = {
  creative: {
    title: "The Creative Thinker",
    emoji: "🎨",
    description:
      "Kamu cenderung menikmati kebebasan berekspresi, mencoba ide baru, dan menghasilkan sesuatu yang unik.",
    strengths: [
      "Imajinasi dan kreativitas",
      "Kemampuan menuangkan ide",
      "Berpikir di luar kebiasaan"
    ],
    fields: [
      "Desain dan seni",
      "Media dan komunikasi",
      "Industri kreatif"
    ]
  },

  analytical: {
    title: "The Analytical Thinker",
    emoji: "🔍",
    description:
      "Kamu cenderung tertarik memahami sesuatu, mencari informasi, dan menyelesaikan masalah melalui pemikiran logis.",
    strengths: [
      "Berpikir kritis",
      "Analisis dan pemecahan masalah",
      "Rasa ingin tahu"
    ],
    fields: [
      "Teknologi informasi",
      "Riset dan analisis data",
      "Sains dan penelitian"
    ]
  },

  social: {
    title: "The Social Connector",
    emoji: "🤝",
    description:
      "Kamu cenderung menikmati interaksi, komunikasi, dan kegiatan yang melibatkan orang lain.",
    strengths: [
      "Komunikasi",
      "Kerja sama tim",
      "Kepedulian terhadap orang lain"
    ],
    fields: [
      "Pendidikan",
      "Komunikasi dan hubungan masyarakat",
      "Pelayanan dan kegiatan sosial"
    ]
  },

  organized: {
    title: "The Organized Planner",
    emoji: "📋",
    description:
      "Kamu cenderung menyukai keteraturan, perencanaan, dan kegiatan yang memiliki tujuan serta langkah jelas.",
    strengths: [
      "Manajemen waktu",
      "Perencanaan",
      "Pengorganisasian"
    ],
    fields: [
      "Manajemen dan administrasi",
      "Bisnis dan manajemen proyek",
      "Event management"
    ]
  }
};


// ==========================================
// 3. MENJALANKAN PERSONALITY QUIZ
// ==========================================

let currentQuestion = 0;
let personalityAnswers = [];

function startPersonalityQuiz() {
  currentQuestion = 0;
  personalityAnswers = [];

  $("#personalityQuiz").classList.remove("d-none");
  $("#personalityResult").classList.add("d-none");

  renderPersonalityQuestion();
}

function renderPersonalityQuestion() {
  const question = personalityQuestions[currentQuestion];

  $("#personalityQuestions").innerHTML = `
    <div class="mb-3">
      <span class="eyebrow">
        PERTANYAAN ${currentQuestion + 1} DARI ${personalityQuestions.length}
      </span>

      <h4 class="fw-bold mt-2">
        ${question.question}
      </h4>
    </div>

    <div class="d-grid gap-3">
      ${question.options.map((option, index) => `
        <label class="interest-option">
          <input
            type="radio"
            name="personalityAnswer"
            value="${option.type}"
            ${personalityAnswers[currentQuestion] === option.type ? "checked" : ""}
          >

          <span>${option.text}</span>
        </label>
      `).join("")}
    </div>
  `;

  $("#personalityProgress").innerHTML = `
    <div class="progress" style="height:8px">
      <div
        class="progress-bar"
        style="width:${((currentQuestion + 1) / personalityQuestions.length) * 100}%; background:#7256d8"
      ></div>
    </div>

    <p class="small text-muted mt-2">
      ${currentQuestion + 1} / ${personalityQuestions.length} pertanyaan
    </p>
  `;

  $("#prevQuestion").disabled = currentQuestion === 0;

  $("#nextQuestion").classList.toggle(
    "d-none",
    currentQuestion === personalityQuestions.length - 1
  );

  $("#finishPersonality").classList.toggle(
    "d-none",
    currentQuestion !== personalityQuestions.length - 1
  );
}


// Tombol sebelumnya

$("#prevQuestion").addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderPersonalityQuestion();
  }
});


// Tombol selanjutnya

$("#nextQuestion").addEventListener("click", () => {
  const selected = $('input[name="personalityAnswer"]:checked');

  if (!selected) {
    alert("Pilih salah satu jawaban terlebih dahulu.");
    return;
  }

  personalityAnswers[currentQuestion] = selected.value;

  currentQuestion++;
  renderPersonalityQuestion();
});


// Tombol lihat hasil

$("#finishPersonality").addEventListener("click", () => {
  const selected = $('input[name="personalityAnswer"]:checked');

  if (!selected) {
    alert("Pilih salah satu jawaban terlebih dahulu.");
    return;
  }

  personalityAnswers[currentQuestion] = selected.value;

  calculatePersonality();
});


// ==========================================
// 4. ANALISIS HASIL PERSONALITY
// ==========================================

function calculatePersonality() {
  const scores = {
    creative: 0,
    analytical: 0,
    social: 0,
    organized: 0
  };

  personalityAnswers.forEach(answer => {
    scores[answer]++;
  });

  const sorted = Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  );

  const mainType = sorted[0][0];
  const result = personalityTypes[mainType];

  state.personalityResult = {
    type: mainType,
    title: result.title,
    date: new Date().toLocaleDateString("id-ID")
  };

  localStorage.setItem(
    "eduplay_personality",
    JSON.stringify(state.personalityResult)
  );

  $("#personalityQuiz").classList.add("d-none");
  $("#personalityResult").classList.remove("d-none");

  $("#personalityResult").innerHTML = `
    <div class="text-center mb-4">
      <div style="font-size:4rem">${result.emoji}</div>

      <span class="eyebrow">HASIL EKSPLORASI DIRIMU</span>

      <h2 class="fw-bold mt-2">
        ${result.title}
      </h2>

      <p class="text-muted">
        ${result.description}
      </p>
    </div>

    <div class="row g-3">

      <div class="col-md-6">
        <div class="fact-box h-100">
          <h5 class="fw-bold">✨ Kecenderungan Kekuatan</h5>

          <ul class="mb-0">
            ${result.strengths.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="col-md-6">
        <div class="fact-box h-100">
          <h5 class="fw-bold">🚀 Bidang yang Bisa Dieksplorasi</h5>

          <ul class="mb-0">
            ${result.fields.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>

    </div>

    <p class="small text-muted mt-4">
      Hasil ini menggambarkan kecenderungan berdasarkan jawabanmu,
      bukan label kepribadian permanen atau penilaian psikologis.
    </p>

    <div class="d-flex flex-wrap gap-2 mt-3">
      <button class="btn btn-primary" id="retryPersonality">
        Ulangi Tes
      </button>

      <button class="btn btn-outline-primary" id="goCareer">
        Jelajahi Skill →
      </button>
    </div>
  `;

  $("#retryPersonality").addEventListener("click", startPersonalityQuiz);

  $("#goCareer").addEventListener("click", () => {
    showPage("skills");
  });

  $("#personalityResult").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// ==========================================
// 5. DATA MINAT DAN REKOMENDASI KARIER
// ==========================================

const careerData = {
  cooking: {
    name: "Memasak dan Membuat Kue",
    emoji: "🍳",
    field: "Kuliner",
    skills: ["Kreativitas rasa", "Ketelitian", "Manajemen waktu"],
    jobs: ["Chef", "Pastry Chef", "Baker", "Food Stylist"],
    challenge: "Coba membuat satu resep sederhana dan dokumentasikan prosesnya."
  },

  beauty: {
    name: "Makeup dan Kecantikan",
    emoji: "💄",
    field: "Kecantikan",
    skills: ["Kreativitas visual", "Komunikasi", "Ketelitian"],
    jobs: ["Makeup Artist", "Beauty Consultant", "Beauty Content Creator"],
    challenge: "Buat panduan sederhana tentang langkah perawatan atau makeup."
  },

  design: {
    name: "Menggambar dan Mendesain",
    emoji: "🎨",
    field: "Desain dan Kreatif",
    skills: ["Komposisi visual", "Ilustrasi", "Pemecahan masalah kreatif"],
    jobs: ["Graphic Designer", "Illustrator", "UI/UX Designer"],
    challenge: "Buat desain poster sederhana dengan tema yang kamu sukai."
  },

  editing: {
    name: "Mengedit Foto dan Video",
    emoji: "🎬",
    field: "Media Digital",
    skills: ["Storytelling visual", "Kreativitas", "Penguasaan tools digital"],
    jobs: ["Video Editor", "Content Creator", "Motion Graphic Designer"],
    challenge: "Buat video pendek berdurasi 30 detik dengan konsep sendiri."
  },

  tech: {
    name: "Teknologi dan Komputer",
    emoji: "💻",
    field: "Teknologi Informasi",
    skills: ["Logika", "Pemecahan masalah", "Literasi digital"],
    jobs: ["Programmer", "Web Developer", "IT Support", "System Analyst"],
    challenge: "Coba buat halaman website sederhana menggunakan HTML."
  },

  business: {
    name: "Berjualan dan Berbisnis",
    emoji: "💰",
    field: "Bisnis dan Pemasaran",
    skills: ["Komunikasi persuasif", "Perencanaan", "Analisis kebutuhan"],
    jobs: ["Entrepreneur", "Digital Marketer", "Sales Executive", "Business Development"],
    challenge: "Buat ide produk sederhana beserta target pembelinya."
  },

  helping: {
    name: "Mengajar dan Membantu Orang",
    emoji: "🤝",
    field: "Pendidikan dan Sosial",
    skills: ["Empati", "Komunikasi", "Kesabaran"],
    jobs: ["Guru", "Tutor", "Konselor Pendidikan", "Community Officer"],
    challenge: "Coba buat materi singkat untuk menjelaskan satu topik kepada teman."
  },

  photo: {
    name: "Fotografi dan Membuat Konten",
    emoji: "📸",
    field: "Fotografi dan Media",
    skills: ["Kepekaan visual", "Komposisi", "Observasi"],
    jobs: ["Photographer", "Photojournalist", "Product Photographer"],
    challenge: "Ambil lima foto dengan tema yang sama dan buat cerita dari hasilnya."
  },

  writing: {
    name: "Menulis dan Bercerita",
    emoji: "✍️",
    field: "Komunikasi dan Media",
    skills: ["Menulis", "Riset informasi", "Storytelling"],
    jobs: ["Writer", "Copywriter", "Journalist", "Content Writer"],
    challenge: "Tulis artikel pendek tentang topik yang sedang kamu sukai."
  },

  event: {
    name: "Mengatur Acara dan Kegiatan",
    emoji: "🎤",
    field: "Event dan Manajemen",
    skills: ["Organisasi", "Kerja sama tim", "Manajemen waktu"],
    jobs: ["Event Organizer", "Project Coordinator", "Wedding Planner"],
    challenge: "Buat rancangan acara kecil lengkap dengan jadwal kegiatannya."
  },

  craft: {
    name: "Membuat dan Memperbaiki Sesuatu",
    emoji: "🔧",
    field: "Keterampilan Teknis dan Produk",
    skills: ["Ketelitian", "Keterampilan praktis", "Berpikir sistematis"],
    jobs: ["Product Designer", "Teknisi", "Maker/Crafter", "Quality Control"],
    challenge: "Buat atau perbaiki benda sederhana dengan tetap memperhatikan keselamatan."
  },

  research: {
    name: "Mencari Tahu dan Menganalisis",
    emoji: "🔍",
    field: "Riset dan Analisis",
    skills: ["Berpikir kritis", "Analisis data", "Rasa ingin tahu"],
    jobs: ["Research Assistant", "Data Analyst", "Quality Analyst"],
    challenge: "Pilih satu topik, kumpulkan informasi, lalu buat kesimpulan sederhana."
  }
};


// ==========================================
// 6. AKTIVITAS YANG DISUKAI
// ==========================================

const activityData = {
  create: {
    title: "Kreativitas dan Menghasilkan Karya",
    description: "Kamu menikmati proses menciptakan ide dan menghasilkan sesuatu."
  },

  solve: {
    title: "Analisis dan Pemecahan Masalah",
    description: "Kamu menikmati tantangan berpikir dan mencari solusi."
  },

  people: {
    title: "Komunikasi dan Kolaborasi",
    description: "Kamu menikmati interaksi dan bekerja bersama orang lain."
  },

  organize: {
    title: "Perencanaan dan Pengelolaan",
    description: "Kamu menikmati kegiatan yang membutuhkan perencanaan."
  }
};


// ==========================================
// 7. ANALISIS CAREER EXPLORER
// ==========================================

$("#analyzeCareer").addEventListener("click", () => {

  const selectedInterests = $$('input[name="interest"]:checked')
    .map(input => input.value);

  const selectedActivity = $('input[name="activity"]:checked');

  $("#careerError").textContent = "";

  if (selectedInterests.length === 0) {
    $("#careerError").textContent =
      "Pilih minimal satu hal yang kamu sukai terlebih dahulu.";
    return;
  }

  if (!selectedActivity) {
    $("#careerError").textContent =
      "Pilih aktivitas yang paling kamu nikmati.";
    return;
  }

  const activity = activityData[selectedActivity.value];

  const recommendations = selectedInterests.map(key => {
    return careerData[key];
  }).filter(Boolean);

  state.careerResult = {
    interests: selectedInterests,
    activity: selectedActivity.value,
    date: new Date().toLocaleDateString("id-ID")
  };

  localStorage.setItem(
    "eduplay_career",
    JSON.stringify(state.careerResult)
  );

  displayCareerResults(recommendations, activity);
});


// ==========================================
// 8. MENAMPILKAN HASIL REKOMENDASI
// ==========================================

function displayCareerResults(recommendations, activity) {

  const resultArea = $("#careerResults");

  resultArea.classList.remove("d-none");

  resultArea.innerHTML = `
    <div class="text-center mb-4">
      <div style="font-size:3.5rem">🌟</div>

      <span class="eyebrow">YOUR DISCOVERY RESULT</span>

      <h2 class="fw-bold mt-2">
        Ini Potensi yang Bisa Kamu Eksplorasi!
      </h2>

      <p class="text-muted">
        Berdasarkan pilihanmu, berikut beberapa bidang
        keterampilan dan profesi yang bisa kamu pelajari lebih lanjut.
      </p>
    </div>

    <div class="fact-box mb-4">
      <h5 class="fw-bold">🎯 Aktivitas yang Kamu Nikmati</h5>
      <h4 class="mt-2">${activity.title}</h4>
      <p class="mb-0">${activity.description}</p>
    </div>

    <h4 class="fw-bold mb-3">Rekomendasi Bidang dan Skill</h4>

    <div class="row g-3">

      ${recommendations.map(item => `
        <div class="col-md-6">

          <article class="game-card h-100">

            <div class="game-emoji">${item.emoji}</div>

            <span class="eyebrow">BIDANG YANG BISA DIEKSPLORASI</span>

            <h4 class="fw-bold mt-2">${item.field}</h4>

            <p class="text-muted">${item.name}</p>

            <hr>

            <h6 class="fw-bold">Skill yang Bisa Dikembangkan</h6>

            <ul>
              ${item.skills.map(skill => `<li>${skill}</li>`).join("")}
            </ul>

            <h6 class="fw-bold mt-3">Contoh Profesi</h6>

            <div class="d-flex flex-wrap gap-2">
              ${item.jobs.map(job => `
                <span class="badge bg-light text-dark p-2">${job}</span>
              `).join("")}
            </div>

            <div class="fact-box mt-3">
              <strong>💡 Tantangan untukmu:</strong>
              <p class="mb-0 mt-1">${item.challenge}</p>
            </div>

          </article>

        </div>
      `).join("")}

    </div>

    <div class="text-center mt-4">
      <p class="small text-muted">
        Rekomendasi ini dibuat berdasarkan minat yang kamu pilih.
        Minat bukan berarti kamu sudah menguasai keterampilan tersebut.
        Kamu tetap bisa mencoba dan mengembangkannya.
      </p>

      <button class="btn btn-outline-primary" id="repeatCareer">
        Ubah Pilihan
      </button>

      <button class="btn btn-primary" id="goProfile">
        Lihat Profil Saya
      </button>
    </div>
  `;

  $("#repeatCareer").addEventListener("click", () => {
    resultArea.classList.add("d-none");
    $("#interestOptions").scrollIntoView({
      behavior: "smooth"
    });
  });

  $("#goProfile").addEventListener("click", () => {
    showPage("profile");
  });

  resultArea.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// ==========================================
// 9. PROFIL PENGGUNA
// ==========================================

function renderProfile() {

  $("#playerName").value = state.name;

  const saved = $("#savedCareerProfile");

  let html = "";

  if (state.personalityResult) {
    html += `
      <div class="fact-box mb-3">
        <span class="eyebrow">PERSONALITY DISCOVERY</span>
        <h5 class="fw-bold mt-2">
          ${state.personalityResult.title}
        </h5>
        <p class="small text-muted mb-0">
          Tanggal eksplorasi: ${state.personalityResult.date}
        </p>
      </div>
    `;
  }

  if (state.careerResult) {
    const names = state.careerResult.interests
      .map(key => careerData[key]?.name)
      .filter(Boolean);

    html += `
      <div class="fact-box mb-3">
        <span class="eyebrow">CAREER & SKILL EXPLORER</span>
        <h5 class="fw-bold mt-2">Minat yang Kamu Pilih</h5>
        <ul>
          ${names.map(name => `<li>${name}</li>`).join("")}
        </ul>
        <p class="small text-muted mb-0">
          Tanggal eksplorasi: ${state.careerResult.date}
        </p>
      </div>
    `;
  }

  if (!html) {
    html = `
      <p class="text-muted">
        Kamu belum memiliki hasil eksplorasi.
        Yuk, mulai kenali dirimu!
      </p>
    `;
  }

  saved.innerHTML = html;
}


// ==========================================
// 10. SIMPAN NAMA
// ==========================================

$("#saveName").addEventListener("click", () => {

  const value = $("#playerName").value.trim();

  if (!value) {
    alert("Masukkan nama panggilan terlebih dahulu.");
    return;
  }

  state.name = value;

  localStorage.setItem("eduplay_name", value);

  alert("Nama berhasil disimpan!");

});


// ==========================================
// 11. INISIALISASI WEBSITE
// ==========================================

function initializeEduPlay() {

  $("#playerName").value = state.name;

  renderProfile();

  // Personality quiz
  startPersonalityQuiz();

}

initializeEduPlay();
