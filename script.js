// Paste your Web App URL from Google Apps Script here
const GAS_URL = 'YOUR_WEB_APP_URL_HERE'; // Make sure to replace this with your actual URL!

const quizData = [
  {
    question: "Siapa yang mau kamu kasih hadiah?",
    options: [
      { text: "Laki-laki", value: "male" },
      { text: "Perempuan", value: "female" },
    ],
  },
  {
    question: "Hadiah kayak apa yang paling doi suka? 🎁",
    options: [
      { text: "Sesuatu yang bisa bikin ketawa 🤣✨", personality: "Jolly", weight: 1 },
      { text: "Sesuatu yang fungsional dan berguna 📖", personality: "Snip", weight: 1 },
      { text: "Hadiah yang bikin nyaman dan menenangkan 🛋️🕯️", personality: "Slick", weight: 1 },
      { text: "Hadiah yang bisa nyimpen kenangan 💌🖼", personality: "Buck", weight: 1 },
    ],
  },
  {
    question: "Gimana perasaan doi kalau hadiahnya gak sesuai selera?",
    options: [
      { text: "Gak masalah, tetep spesial kok! 😆💖", personality: "Jolly", weight: 1 },
      { text: "Sebenernya agak kurang cocok sih, tapi makasih 🙏", personality: "Snip", weight: 1 },
      { text: "Yang aku liat niatnya 😊💫", personality: "Slick", weight: 1 },
      { text: "Disimpen di rumah aja deh 😬📦", personality: "Buck", weight: 1 },
    ],
  },
  {
    question: "Doi kalo lagi gabut biasanya ngapain aja?",
    options: [
      { text: "Ngumpul bareng temen 🥳🎤", personality: "Jolly", weight: 1 },
      { text: "Ngulik barang / belajar baru 🔍⚙️", personality: "Snip", weight: 1 },
      { text: "Nonton film, baca buku 📚🍵", personality: "Slick", weight: 1 },
      { text: "Bikin seni, denger lagu galau 🎨🎧", personality: "Buck", weight: 1 },
    ],
  },
  {
    question: "Dari semua ini, mana yang doi banget? 😍",
    options: [
      { text: "Suka rame, ceria! 🥳🌟", personality: "Jolly", weight: 3 },
      { text: "Serius, eksploratif 🚀💼", personality: "Snip", weight: 3 },
      { text: "Cinta damai, chill abis ☁️🧘", personality: "Slick", weight: 3 },
      { text: "Perasa, nyeni banget 🎭💖", personality: "Buck", weight: 3 },
    ],
  },
];

let currentQ = 0;
let userAge = 0;
let answers = [];
let scores = { Jolly: 0, Snip: 0, Slick: 0, Buck: 0 };

const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const ageScreen = document.getElementById("age-screen");

const questionText = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const resultCard = document.getElementById("result-card");
const personalityImage = document.getElementById("personality-image");

startBtn.addEventListener("click", () => {
  const ageInput = document.getElementById("age-input").value;
  if (!ageInput) return alert("Isi umur dulu ya!");
  userAge = ageInput;
  ageScreen.classList.remove("active");
  questionScreen.classList.add("active");
  showQuestion();
});

nextBtn.addEventListener("click", () => {
  currentQ++;
  if (currentQ < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQ > 0) {
    currentQ--;
    showQuestion();
  }
});

restartBtn.addEventListener("click", () => {
  location.reload();
});

function showQuestion() {
  const q = quizData[currentQ];
  questionText.textContent = q.question;
  optionsDiv.innerHTML = "";
  
  nextBtn.classList.add("hidden");
  prevBtn.classList.add("hidden");

  if (currentQ > 0) {
    prevBtn.classList.remove("hidden");
  }

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt.text;
    btn.onclick = (event) => selectOption(opt, event.target);
    optionsDiv.appendChild(btn);
  });

  if (answers[currentQ]) {
    const previousAnswer = answers[currentQ];
    const optionButtons = optionsDiv.querySelectorAll('.option');
    q.options.forEach((opt, index) => {
        if (opt.text === previousAnswer.text) {
            optionButtons[index].classList.add('selected');
        }
    });
    nextBtn.classList.remove("hidden");
  }
}

function selectOption(opt, selectedButton) {
  const allOptions = optionsDiv.querySelectorAll('.option');
  allOptions.forEach(b => b.classList.remove('selected'));
  selectedButton.classList.add('selected');

  const oldAnswer = answers[currentQ];
  if (oldAnswer && oldAnswer.personality) {
    scores[oldAnswer.personality] -= oldAnswer.weight;
  }
  
  if (opt.personality) {
    scores[opt.personality] += opt.weight;
  }
  
  answers[currentQ] = opt;
  nextBtn.classList.remove("hidden");
}

async function showResult() {
  questionScreen.classList.remove("active");
  resultScreen.classList.add("active");
  resultCard.innerHTML = `
    <img id="personality-image" src="" alt="Personality Image" class="personality-img">
    <p>Menghitung dan menyimpan hasil...</p>
  `;

  const topPersonality = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  let imagePath = '';
  switch (topPersonality) {
    case 'Buck':
      imagePath = '01 BUCK.png';
      break;
    case 'Slick':
      imagePath = '02 SLICK.png';
      break;
    case 'Jolly':
      imagePath = '03 JOLLY.png';
      break;
    case 'Snip':
      imagePath = '04 SNIP.png';
      break;
    default:
      imagePath = '';
  }

  // Baris '<h3>' telah dihapus dari sini
  resultCard.innerHTML = `
    <img id="personality-image" src="${imagePath}" alt="${topPersonality} Personality" class="personality-img">
    <p>Kepribadian kamu mirip dengan karakter <strong>${topPersonality}</strong>! Hasil telah disimpan.</p>
  `;

  const dataToSend = {
    age: userAge,
    gender: answers[0].value,
    finalPersonality: topPersonality,
    scores: scores,
  };

  try {
    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
      redirect: 'follow',
    });
  } catch (error) {
    console.error('Error saving data:', error);
  }
}