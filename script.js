// State Variables
let currentLevel = 1;
let score = 0;
let questionCount = 0;
let correctAnswer = 0;
let timerInterval;
const totalQuestions = 30; // Quiz ends after 30 questions

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

// Utility: Random Integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility: Random Number including negatives
function getRandomIntWithNeg(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    if(Math.random() < 0.5 && num !== 0) num = -num;
    return num;
}

// --- Question Generators based on Level ---

function generateQuestion(level) {
    let q = "";
    let ans = 0;
    let type = "";

    // Class 1-2: Basic Arithmetic
    if (level <= 2) {
        const a = getRandomInt(1, 20);
        const b = getRandomInt(1, 20);
        const op = Math.random() > 0.5 ? '+' : '-';

        if (op === '+') {
            q = `${a} + ${b}`;
            ans = a + b;
        } else {
            // Ensure no negative answers for early levels
            const max = Math.max(a, b);
            const min = Math.min(a, b);
            q = `${max} - ${min}`;
            ans = max - min;
        }
    }

    // Class 3-4: Multiplication, Division, Basic Word Logic
    else if (level <= 4) {
        const type = getRandomInt(1, 3);
        if (type === 1) { // Multiplication
            const a = getRandomInt(2, 12);
            const b = getRandomInt(2, 12);
            q = `${a} × ${b}`;
            ans = a * b;
        } else if (type === 2) { // Simple Division
            const b = getRandomInt(2, 10);
            ans = getRandomInt(2, 10);
            const a = b * ans;
            q = `${a} ÷ ${b}`;
        } else { // Word problem style logic (e.g., squares)
            const a = getRandomInt(2, 10);
            q = `${a}² (Square of ${a})`;
            ans = a * a;
        }
    }

    // Class 5-6: Algebra, LCM, HCF, Decimals
    else if (level <= 6) {
        const type = getRandomInt(1, 3);
        if (type === 1) { // Simple Algebra
            const x = getRandomInt(1, 10);
            const a = getRandomInt(2, 9);
            const b = getRandomInt(1, 20);
            // ax + b = ?
            q = `If x = ${x}, what is ${a}x + ${b}?`;
            ans = (a * x) + b;
        } else if (type === 2) { // Simple Equation Solution
            const a = getRandomInt(2, 5);
            const b = getRandomInt(5, 20);
            const x = getRandomInt(1, 10);
            // ax - b = c -> x = ?
            const c = (a * x) - b;
            q = `Solve: ${a}x - ${b} = ${c}`;
            ans = x;
        } else { // Average/Mean
            const nums = [getRandomInt(1,10), getRandomInt(1,10), getRandomInt(1,10)];
            const sum = nums.reduce((a, b) => a + b, 0);
            ans = Math.floor(sum / 3);
            q = `Average of ${nums[0]}, ${nums[1]}, ${nums[2]}`;
        }
    }

    // Class 7-8: Integers, Simple Factors, Geometry Area
    else if (level <= 8) {
        const type = getRandomInt(1, 3);
        if (type === 1) { // Integer Arithmetic
            const a = getRandomIntWithNeg(-15, 15);
            const b = getRandomIntWithNeg(-15, 15);
            q = `${a} + (${b})`;
            ans = a + b;
        } else if (type === 2) { // Percentage
            const x = getRandomInt(1, 20) * 10; // 10, 20... 200
            const p = getRandomInt(1, 9) * 10; // 10, 20... 90
            q = `${p}% of ${x}`;
            ans = (p * x) / 100;
        } else { // Area of Rectangle
            const l = getRandomInt(5, 15);
            const w = getRandomInt(5, 15);
            q = `Area of rectangle with length ${l} and width ${w}`;
            ans = l * w;
        }
    }

  // Class 9-10: Quadratics, Trigonometry (Simple), Polynomials
    else {
        const type = getRandomInt(1, 3);
        if (type === 1) { // Quadratic Equation Roots
            // (x - r1)(x - r2) = 0 form
            const r1 = getRandomInt(-5, 5);
            const r2 = getRandomInt(-5, 5);
            const b = -(r1 + r2);
            const c = r1 * r2;
            // x^2 + bx + c = 0
            const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
            q = `Find the sum of roots for: x² ${signB}x ${signC} = 0`;
            ans = r1 + r2;
        } else if (type === 2) { // Slope of Line
            const x1 = 0, y1 = getRandomInt(-10, 10);
            const x2 = getRandomInt(1, 10);
            const y2 = getRandomInt(-10, 10);
            const m = (y2 - y1) / (x2 - x1);
            q = `Slope of line passing (${x1},${y1}) and (${x2},${y2})`;
            // Avoid division by zero or weird decimals for this demo
            if (Number.isInteger(m)) ans = m;
            else { ans = "Undefined/Decimal"; q = "Simplified: 6/2(1+2)"; ans = 9; } // Fallback safety
        } else { // Indices
            const a = getRandomInt(2, 5);
            q = `${a}³`;
            ans = a * a * a;
        }
    }

    return { q, ans };
}

// --- Game Logic ---

function startQuiz(level) {
    currentLevel = level;
    score = 0;
    questionCount = 0;

    // Update UI
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    scoreDisplay.innerText = `Score: 0`;
    levelDisplay.innerText = `Level: Class ${level}`;

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
    optionsContainer.innerHTML = ''; // Clear old buttons

    // Update progress bar
    const progress = (questionCount / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;

    // Generate new question
    const problem = generateQuestion(currentLevel);
    questionText.innerText = problem.q;
    correctAnswer = problem.ans;

    // Generate Options (1 correct, 3 wrong)
    let answers = new Set();
    answers.add(correctAnswer);

    while (answers.size < 4) {
        // Generate wrong answer close to real answer
        let wrong = correctAnswer + getRandomInt(-5, 5);
        if (wrong === correctAnswer) wrong += getRandomInt(1, 10);
        // If answer is "Undefined", don't try to calculate math on it
        if (typeof correctAnswer === 'number') {
            answers.add(wrong);
        } else {
            answers.add(wrong); // Just add random numbers if logic fails
        }
    }

    // Convert Set to Array and shuffle
    const answersArray = Array.from(answers).sort(() => Math.random() - 0.5);

    // Create Buttons
    answersArray.forEach(ans => {
        const btn = document.createElement('button');
        btn.innerText = ans;
        btn.classList.add('option-btn');
        btn.onclick = () => checkAnswer(btn, ans);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(btn, selectedValue) {
    // Disable all buttons to prevent double clicking
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedValue == correctAnswer) {
        btn.classList.add('correct');
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    } else {
        btn.classList.add('wrong');
        // Highlight the correct one
        allBtns.forEach(b => {
            if (parseFloat(b.innerText) == correctAnswer) {
                b.classList.add('correct');
            }
        });
    }

    nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
    resetTimer();
    startTimer();
    loadQuestion();
}

function endQuiz() {
    clearInterval(timerInterval);
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    document.getElementById('final-score').innerText = `${score}/${totalQuestions}`;

    const feedback = document.getElementById('feedback-text');
    if(score === 10) feedback.innerText = "Perfect Score! You're a Math Genius! 🌟";
    else if(score > 7) feedback.innerText = "Great Job! Keep it up! 👍";
    else if(score > 4) feedback.innerText = "Good effort, but you can do better! 💪";
    else feedback.innerText = "Keep practicing! Practice makes perfect. 📚";
}

// --- Timer Logic ---
let timeLeft = 30;

function startTimer() {
    timeLeft = 30; // 30 seconds per question
    timerDisplay.innerText = `Time: 00:${timeLeft}`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time: 00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Time's up - auto move to next question
            const allBtns = document.querySelectorAll('.option-btn');
            allBtns.forEach(b => {
                b.disabled = true;
                if (parseFloat(b.innerText) == correctAnswer) {
                    b.classList.add('correct');
                }
            });
            nextBtn.style.display = 'inline-block';
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
}