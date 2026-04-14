// State Variables
let currentLevel = 1;
let score = 0;
let questionCount = 0;
let correctAnswer = 0;
let timerInterval;
let usedQuestions = new Set(); // Track used questions to prevent repeats
const totalQuestions = 30; // Fixed 30 questions

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const progressBar = document.getElementById('progress-bar');

// Utility Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntWithNeg(min, max) {
    let num = getRandomInt(min, max);
    if (Math.random() < 0.5 && num !== 0) num = -num;
    return num;
}

function generateQuestionHash(q, level) {
    return `${level}_${q.replace(/[^a-zA-Z0-9]/g, '_')}`.substring(0, 50);
}

// --- TOUGHER Question Generators ---

function generateQuestion(level) {
    let q = "", ans = 0;
    
    // Ensure no repeats by generating until unique
    let attempts = 0;
    while (attempts < 10) {
        attempts++;
        
        // Class 1-2: Basic but with word problems (TOUGHER)
        if (level <= 2) {
            const type = getRandomInt(1, 3);
            if (type === 1) { // Money problem
                const a = getRandomInt(1, 50);
                const b = getRandomInt(1, 30);
                q = `Raju has ₹${a}. He buys toy for ₹${b}. How much money left?`;
                ans = a - b;
            } else if (type === 2) { // Age problem
                const age = getRandomInt(5, 15);
                q = `If Ravi is ${age} years old, how many months old is he?`;
                ans = age * 12;
            } else {
                const apples = getRandomInt(2, 8);
                const friends = getRandomInt(2, 4);
                q = `${apples} apples shared equally among ${friends} friends. Each gets?`;
                ans = Math.floor(apples / friends);
            }
        }
        
        // Class 3-4: Multi-step operations (TOUGHER)
        else if (level <= 4) {
            const type = getRandomInt(1, 4);
            if (type === 1) { // Multi-step
                const a = getRandomInt(5, 15);
                const b = getRandomInt(2, 8);
                q = `( ${a} × ${b} ) + ${b}`;
                ans = (a * b) + b;
            } else if (type === 2) { // Division with remainder
                const dividend = getRandomInt(20, 50);
                const divisor = getRandomInt(3, 8);
                q = `Quotient when ${dividend} ÷ ${divisor}`;
                ans = Math.floor(dividend / divisor);
            } else if (type === 3) { // Cubes
                const a = getRandomInt(2, 6);
                q = `${a}³ = ?`;
                ans = a * a * a;
            } else {
                const a = getRandomInt(10, 25);
                const b = getRandomInt(2, 5);
                q = `Successor of ${a} × ${b}`;
                ans = (a * b) + 1;
            }
        }
        
        // Class 5-6: Complex algebra + fractions (TOUGHER)
        else if (level <= 6) {
            const type = getRandomInt(1, 4);
            if (type === 1) { // Two-step equation
                const x = getRandomInt(2, 8);
                const a = getRandomInt(2, 5);
                q = `Solve: 3x + ${a} = ${3*x + a}`;
                ans = x;
            } else if (type === 2) { // Fraction simplification
                const num = getRandomInt(4, 12);
                const den = getRandomInt(6, 15);
                const gcd = [1,2,3,4,5,6].find(d => num%d===0 && den%d===0) || 1;
                q = `Simplify ${num}/${den}`;
                ans = `${num/gcd}/${den/gcd}`;
            } else if (type === 3) { // Speed-distance
                const speed = getRandomInt(20, 40);
                const time = getRandomInt(2, 5);
                q = `Car at ${speed} km/h for ${time} hrs. Distance?`;
                ans = speed * time;
            } else {
                const nums = Array(4).fill().map(() => getRandomInt(1,15));
                const avg = Math.floor(nums.reduce((a,b)=>a+b)/4);
                q = `Average of ${nums.join(', ')}`;
                ans = avg;
            }
        }
        
        // Class 7-8: Advanced percentages, profit/loss, geometry (TOUGHER)
        else if (level <= 8) {
            const type = getRandomInt(1, 4);
            if (type === 1) { // Profit/Loss
                const cp = getRandomInt(200, 500);
                const sp = cp + getRandomInt(50, 150);
                const profit = sp - cp;
                q = `CP=₹${cp}, SP=₹${sp}. Profit %?`;
                ans = Math.round((profit/cp)*100);
            } else if (type === 2) { // Compound interest (simple)
                const p = 1000;
                const r = getRandomInt(5, 10);
                const t = 2;
                q = `₹${p} at ${r}% p.a. for 2 yrs. Simple Interest?`;
                ans = Math.round((p*r*t)/100);
            } else if (type === 3) { // Circle area
                const r = getRandomInt(5, 12);
                q = `Area of circle radius ${r} units (use π=22/7, nearest integer)`;
                ans = Math.round((22/7)*r*r);
            } else {
                const a = getRandomIntWithNeg(-20, 20);
                const b = getRandomIntWithNeg(-20, 20);
                q = `Simplify: ${a}² - ${b}²`;
                ans = (a*a) - (b*b);
            }
        }
        
        // Class 9-10: COMPETITIVE LEVEL (TOUGHER)
        else {
            const type = getRandomInt(1, 6);
            if (type === 1) { // Quadratic discriminant analysis
                const a = getRandomInt(1, 4);
                const b = getRandomIntWithNeg(-10, 10);
                const c = getRandomInt(-12, 12);
                const D = b*b - 4*a*c;
                q = `For ${a}x² ${b>=0?`+${b}`:`${b}`}x ${c>=0?`+${c}`:`${c}`} = 0, Nature of roots? (D=?)`;
                ans = D > 0 ? 2 : D === 0 ? 1 : 0;
            } else if (type === 2) { // Trigonometry identities
                const angle = [30, 45, 60][getRandomInt(0,2)];
                q = `sin ${angle}° × cos ${angle}° = ? (exact fraction)`;
                if(angle === 30) ans = "1/4";
                else if(angle === 45) ans = "1/2";
                else ans = "√3/4";
            } else if (type === 3) { // Polynomial remainder theorem
                const x = getRandomInt(1, 4);
                q = `Divide x³ + x² - 5x - 3 by (x-${x}). Remainder?`;
                ans = x*x*x + x*x - 5*x - 3;
            } else if (type === 4) { // Work-time problems
                const rate1 = getRandomInt(3, 8);
                const rate2 = getRandomInt(2, 5);
                const days = getRandomInt(5, 12);
                q = `A+B finish work in ${days} days. A alone: ${rate1} units/day. Total work?`;
                ans = (rate1 + rate2) * days;
            } else if (type === 5) { // AP series
                const a = getRandomInt(2, 10);
                const d = getRandomInt(1, 4);
                const n = 5;
                q = `AP: first ${a}, common diff ${d}. 5th term?`;
                ans = a + (n-1)*d;
            } else { // Heron's formula (triangle inequality ensured)
                let sides = [7,8,9,10,11,12].sort((a,b)=>a-b);
                const s = (sides[0]+sides[1]+sides[2])/2;
                const area = Math.sqrt(s*(s-sides[0])*(s-sides[1])*(s-sides[2]));
                q = `Sides ${sides.join(',')}. Area by Heron (nearest int)?`;
                ans = Math.round(area);
            }
        }
        
        // Check if question is unique
        const qHash = generateQuestionHash(q, level);
        if (!usedQuestions.has(qHash) && attempts < 8) {
            usedQuestions.add(qHash);
            return { q, ans, hash: qHash };
        }
    }
    
    // Fallback if too many repeats
    usedQuestions.clear();
    const fallback = generateQuestion(level);
    return fallback;
}

// --- Game Logic (ENHANCED) ---
function startQuiz(level) {
    currentLevel = level;
    score = 0;
    questionCount = 0;
    usedQuestions.clear(); // Reset for new quiz

    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    scoreDisplay.innerText = `Score: 0`;
    levelDisplay.innerText = `Level: Class ${level} (Expert)`;

    startTimer();
    loadQuestion();
}

function loadQuestion() {
    if (questionCount >= totalQuestions) {
        endQuiz();
        return;
    }

    questionCount++;
    nextBtn.style.display = 'none';
    optionsContainer.innerHTML = '';

    const progress = (questionCount / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;

    const problem = generateQuestion(currentLevel);
    questionText.innerText = `${questionCount}. ${problem.q}`;
    correctAnswer = problem.ans;

    // Smart options generation (TOUGHER distractors)
    let answers = new Set();
    answers.add(correctAnswer);

    // Generate 3 tough distractors
    for(let i = 0; i < 3; i++) {
        let distractor;
        if (typeof correctAnswer === 'string') {
            distractor = correctAnswer.replace(/\d/g, d => (parseInt(d)+1).toString());
        } else if (typeof correctAnswer === 'number') {
            const error = getRandomInt(1, 3);
            distractor = correctAnswer + (Math.random() > 0.5 ? error : -error);
            if (distractor === correctAnswer) distractor += error;
        }
        answers.add(distractor);
    }

    const answersArray = Array.from(answers).sort(() => Math.random() - 0.5);
    answersArray.forEach((ans, idx) => {
        const btn = document.createElement('button');
        btn.innerText = ans;
        btn.classList.add('option-btn');
        btn.onclick = () => checkAnswer(btn, ans);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(btn, selectedValue) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedValue == correctAnswer) {
        btn.classList.add('correct');
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    } else {
        btn.classList.add('wrong');
        allBtns.forEach(b => {
            if (b.innerText == correctAnswer) {
                b.classList.add('correct');
            }
        });
    }

    nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
    resetTimer();
    loadQuestion();
}

function endQuiz() {
    clearInterval(timerInterval);
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    document.getElementById('final-score').innerText = `${score}/${totalQuestions}`;
    
    const percentage = Math.round((score/totalQuestions)*100);
    const feedback = document.getElementById('feedback-text');
    
    if (percentage >= 90) feedback.innerText = "🏆 CHAMPION! Ready for Olympiads! 🌟";
    else if (percentage >= 75) feedback.innerText = "Excellent! 🔥 Top percentile!";
    else if (percentage >= 60) feedback.innerText = "Very Good! Keep pushing! 💪";
    else if (percentage >= 40) feedback.innerText = "Good effort! Practice more! 📚";
    else feedback.innerText = "Challenge accepted! Try again! 🚀";
}

// --- Timer (25s for tougher questions) ---
let timeLeft = 25;

function startTimer() {
    timeLeft = 25;
    timerDisplay.innerText = `Time: 00:${timeLeft}`;

    timerInterval = setInterval(() => {
        timeLeft--;
        const displayTime = timeLeft < 10 ? '0' + timeLeft : timeLeft;
        timerDisplay.innerText = `Time: 00:${displayTime}`;

        if (timeLeft <= 5) timerDisplay.style.color = '#ff4444';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            const allBtns = document.querySelectorAll('.option-btn');
            allBtns.forEach(b => {
                b.disabled = true;
                if (b.innerText == correctAnswer) b.classList.add('correct');
            });
            nextBtn.style.display = 'inline-block';
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerDisplay.style.color = '#333';
    timeLeft = 25;
}