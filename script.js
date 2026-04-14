// ============================================
// MATH CHALLENGE - 30 TOUGH QUESTIONS (NO REPEATS)
// Class 1-10 Competitive Level
// ============================================

// State Variables
let currentLevel = 1;
let score = 0;
let questionCount = 0;
let correctAnswer = 0;
let timerInterval;
let usedQuestions = new Set();
const totalQuestions = 30;

// DOM Elements (MUST exist in HTML)
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
    return `${level}_${q.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40)}`;
}

// ============================================
// SUPER TOUGH QUESTION GENERATOR (NO REPEATS)
// ============================================
function generateQuestion(level) {
    let q = "", ans = 0;
    let attempts = 0;
    
    while (attempts < 10) {
        attempts++;
        const type = getRandomInt(1, 5);

        // CLASS 1-2: Word Problems (TOUGHER)
        if (level <= 2) {
            if (type === 1) {
                const a = getRandomInt(10, 50);
                const b = getRandomInt(5, a-5);
                q = `₹${a} - ₹${b} = ?`;
                ans = a - b;
            } else if (type === 2) {
                const n = getRandomInt(2, 6);
                q = `${n} apples ÷ ${n} children = ?`;
                ans = 1;
            } else {
                const age = getRandomInt(6, 12);
                q = `${age} years = ? months`;
                ans = age * 12;
            }
        } 
        // CLASS 3-4: Multi-Step (TOUGHER)
        else if (level <= 4) {
            if (type === 1) {
                const a = getRandomInt(8, 15);
                const b = getRandomInt(3, 7);
                q = `${a} × ${b} + ${b} = ?`;
                ans = (a * b) + b;
            } else if (type === 2) {
                const num = getRandomInt(20, 40);
                const div = getRandomInt(4, 8);
                q = `${num} ÷ ${div} (quotient only)`;
                ans = Math.floor(num / div);
            } else {
                const n = getRandomInt(3, 5);
                q = `${n}³ = ?`;
                ans = n * n * n;
            }
        }
        // CLASS 5-6: Algebra + Applications (TOUGHER)
        else if (level <= 6) {
            if (type === 1) {
                const x = getRandomInt(3, 7);
                q = `2x + 5 = ${2*x + 5}. Find x`;
                ans = x;
            } else if (type === 2) {
                const speed = getRandomInt(30, 60);
                const time = getRandomInt(2, 4);
                q = `${speed} km/h × ${time} h = ? km`;
                ans = speed * time;
            } else {
                const nums = [getRandomInt(5,15), getRandomInt(5,15), getRandomInt(5,15)];
                const avg = Math.floor(nums.reduce((a,b)=>a+b,0)/3);
                q = `Avg(${nums.join(',')}) = ?`;
                ans = avg;
            }
        }
        // CLASS 7-8: Profit/Loss + Geometry (TOUGHER)
        else if (level <= 8) {
            if (type === 1) {
                const cp = getRandomInt(200, 400);
                const profit = getRandomInt(50, 100);
                q = `CP=₹${cp}, Profit=₹${profit}. Profit %?`;
                ans = Math.round((profit/cp)*100);
            } else if (type === 2) {
                const r = getRandomInt(7, 14);
                q = `Circle r=${r}, Area(22/7)=?`;
                ans = Math.round((22/7)*r*r);
            } else {
                const a = getRandomIntWithNeg(-8, 8);
                const b = getRandomIntWithNeg(-8, 8);
                q = `${a}² - ${b}² = ?`;
                ans = a*a - b*b;
            }
        }
        // CLASS 9-10: COMPETITIVE LEVEL (OLYMPIAD)
        else {
            if (type === 1) {
                const a = getRandomInt(1,3);
                const b = getRandomIntWithNeg(-8,8);
                const c = getRandomInt(-10,10);
                const D = b*b - 4*a*c;
                q = `${a}x²+${b}x+${c}=0. D=?`;
                ans = D;
            } else if (type === 2) {
                const n = getRandomInt(2,5);
                const d = getRandomInt(1,3);
                q = `AP: a=${n}, d=${d}. 4th term?`;
                ans = n + 3*d;
            } else {
                const sides = [6,8,10];
                const s = (sides[0]+sides[1]+sides[2])/2;
                const area = Math.sqrt(s*(s-sides[0])*(s-sides[1])*(s-sides[2]));
                q = `Sides 6,8,10. Heron area?`;
                ans = Math.round(area);
            }
        }

        const qHash = generateQuestionHash(q, level);
        if (!usedQuestions.has(qHash)) {
            usedQuestions.add(qHash);
            return { q, ans };
        }
    }
    
    // Emergency fallback
    usedQuestions.clear();
    return { q: "2+2=?", ans: 4 };
}

// ============================================
// GAME LOGIC
// ============================================
function startQuiz(level) {
    currentLevel = level;
    score = 0;
    questionCount = 0;
    usedQuestions.clear();
    
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    scoreDisplay.innerText = `Score: 0`;
    levelDisplay.innerText = `Class ${level}`;
    
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

    // Progress Bar
    const progress = (questionCount / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;

    // Generate Question
    const problem = generateQuestion(currentLevel);
    questionText.innerText = `${questionCount}/30. ${problem.q}`;
    correctAnswer = problem.ans;

    // Smart Distractors (TOUGH)
    let options = [correctAnswer];
    while (options.length < 4) {
        let wrong;
        if (typeof correctAnswer === 'number') {
            wrong = correctAnswer + getRandomInt(-8, 8);
            if (wrong === correctAnswer || options.includes(wrong)) continue;
        } else {
            wrong = correctAnswer + getRandomInt(1, 3);
        }
        options.push(wrong);
    }
    
    // Shuffle & Display
    options = options.sort(() => Math.random() - 0.5);
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = () => checkAnswer(btn, option);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(btn, selected) {
    // Disable all buttons
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    
    if (selected == correctAnswer) {
        btn.classList.add('correct');
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    } else {
        btn.classList.add('wrong');
        // Show correct answer
        document.querySelectorAll('.option-btn').forEach(b => {
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
    
    const percent = Math.round((score/totalQuestions)*100);
    const feedback = document.getElementById('feedback-text');
    
    if (percent >= 90) feedback.innerText = "🏆 MATH GENIUS! Olympiad Ready! 🌟";
    else if (percent >= 75) feedback.innerText = "Excellent! Top 5%! 🔥";
    else if (percent >= 60) feedback.innerText = "Very Good! Keep Going! 💪";
    else if (percent >= 40) feedback.innerText = "Good Start! Practice More! 📚";
    else feedback.innerText = "Challenge Accepted! Try Again! 🚀";
}

// ============================================
// TIMER SYSTEM (25s per question)
// ============================================
let timeLeft = 25;

function startTimer() {
    timeLeft = 25;
    timerDisplay.innerText = `Time: 00:25`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        const sec = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
        timerDisplay.innerText = `Time: 00:${sec}`;
        
        // Red warning
        if (timeLeft <= 5) {
            timerDisplay.style.color = '#ff4444';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Auto-show correct answer
            document.querySelectorAll('.option-btn').forEach(b => {
                b.disabled = true;
                if (b.innerText == correctAnswer) {
                    b.classList.add('correct');
                }
            });
            nextBtn.style.display = 'inline-block';
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerDisplay.style.color = '#333';
}

// ============================================
// PUBLIC FUNCTIONS (Call from HTML buttons)
// ============================================
function startLevel1() { startQuiz(2); }
function startLevel2() { startQuiz(4); }
function startLevel3() { startQuiz(6); }
function startLevel4() { startQuiz(8); }
function startLevel5() { startQuiz(10); }
