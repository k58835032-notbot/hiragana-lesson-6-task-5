// --- Word List (sample subset for speed, can extend to all 100) ---
const words = [
  "あい","あお","あし","あつい","あき","いけ","いす","いのち",
  "うた","うそ","えき","おに","かぜ","かぎ","かこ","かく",
  "がくせい","きく","きせつ","くつ","くに","けい","こえ","こころ",
  "さけ","さかな","しごと","しずか","すき","せかい","そと","たい",
  "たのしい","ただしい","だいがく","だんな","にんげん"
];

// --- Hiragana to Romaji Converter ---
function hiraToRomaji(hira) {
  const table = {
    あ:"a",い:"i",う:"u",え:"e",お:"o",
    か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko",
    さ:"sa",し:"shi",す:"su",せ:"se",そ:"so",
    た:"ta",ち:"chi",つ:"tsu",て:"te",と:"to",
    な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",
    は:"ha",ひ:"hi",ふ:"fu",へ:"he",ほ:"ho",
    ま:"ma",み:"mi",む:"mu",め:"me",も:"mo",
    や:"ya",ゆ:"yu",よ:"yo",
    ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro",
    わ:"wa",を:"wo",ん:"n",
    が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",
    ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",
    だ:"da",ぢ:"ji",づ:"zu",で:"de",ど:"do",
    ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",
    ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",
    きゃ:"kya",きゅ:"kyu",きょ:"kyo",
    しゃ:"sha",しゅ:"shu",しょ:"sho",
    ちゃ:"cha",ちゅ:"chu",ちょ:"cho",
    にゃ:"nya",にゅ:"nyu",にょ:"nyo",
    ひゃ:"hya",ひゅ:"hyu",ひょ:"hyo",
    みゃ:"mya",みゅ:"myu",みょ:"myo",
    りゃ:"rya",りゅ:"ryu",りょ:"ryo",
    ぎゃ:"gya",ぎゅ:"gyu",ぎょ:"gyo",
    じゃ:"ja",じゅ:"ju",じょ:"jo"
  };
  return hira.replace(/(きゃ|きゅ|きょ|しゃ|しゅ|しょ|ちゃ|ちゅ|ちょ|にゃ|にゅ|にょ|ひゃ|ひゅ|ひょ|みゃ|みゅ|みょ|りゃ|りゅ|りょ|ぎゃ|ぎゅ|ぎょ|じゃ|じゅ|じょ|[ぁ-ん])/g, m => table[m] || m);
}

// --- Generate visually similar distractors ---
function generateDistractors(correct) {
  const variants = [];
  const swapMap = [
    ["a","o"],["i","e"],["u","tsu"],["ka","ga"],["ta","na"],["ki","chi"],["sa","sha"],["so","zo"],["se","ze"]
  ];

  for (let [a,b] of swapMap) {
    if (correct.includes(a)) variants.push(correct.replace(a,b));
  }

  // Randomly drop or duplicate letters for realism
  if (correct.length > 3) variants.push(correct.slice(0, -1));
  if (correct.length > 2) variants.push(correct + correct.slice(-1));

  // Shuffle and keep 3 unique
  return [...new Set(variants)].sort(() => Math.random() - 0.5).slice(0,3);
}

// --- Quiz Logic ---
let current = 0;
let score = 0;
const wordBox = document.getElementById("word");
const optionsBox = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result");

function showQuestion() {
  feedback.innerText = "";
  nextBtn.disabled = true;
  optionsBox.innerHTML = "";

  if (current >= words.length) {
    wordBox.innerText = "Quiz Complete!";
    optionsBox.innerHTML = "";
    resultBox.innerText = `Your Score: ${score} / ${words.length}`;
    nextBtn.style.display = "none";
    return;
  }

  const word = words[current];
  const correct = hiraToRomaji(word);
  const distractors = generateDistractors(correct);

  // Merge and shuffle
  const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

  wordBox.innerText = word;

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(btn, correct);
    optionsBox.appendChild(btn);
  });
}

function selectAnswer(btn, correct) {
  const all = document.querySelectorAll(".option-btn");
  all.forEach(b => b.disabled = true);

  if (btn.innerText === correct) {
    btn.classList.add("correct");
    feedback.innerText = "✅ Correct!";
    score++;
  } else {
    btn.classList.add("wrong");
    feedback.innerText = `❌ Wrong! Correct: ${correct}`;
  }

  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  current++;
  showQuestion();
});

// Start
showQuestion();
