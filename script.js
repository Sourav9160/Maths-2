alert("WELCOME TO THE SITE OF MATHS")
// State Variables
let currentLevel = 1;
let score = 0;
let questionCount = 0;
let correctAnswer = 0;
let timerInterval;
const totalQuestions = 30; // Quiz has 30 questions
let usedQuestions = new Set(); // Track used questions to avoid repetition

// User Details
let userData = {
    name: '',
    gender: '',
    class: ''
};

// DOM Elements
const userDetailsScreen = document.getElementById('user-details-screen');
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
const progressText = document.getElementById('progress-text');

// User Form Handler
document.getElementById('user-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    userData.name = document.getElementById('user-name').value;
    userData.gender = document.getElementById('user-gender').value;
    userData.class = document.getElementById('user-class').value;
    
    // Display user info
    document.getElementById('display-name').innerText = userData.name;
    document.getElementById('display-class').innerText = userData.class;
    document.getElementById('display-gender').innerText = userData.gender;
    
    // Switch screens
    userDetailsScreen.classList.remove('active');
    startScreen.classList.add('active');
});

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

// Utility: Generate unique question identifier
function getQuestionHash(question) {
    return question.replace(/\s/g, '').toLowerCase();
}

// --- Harder Question Generators based on Level ---

function generateQuestion(level) {
    let q = "";
    let ans = 0;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loops
    
    // Keep generating until we get a unique question
    do {
        const result = generateQuestionAttempt(level);
        q = result.q;
        ans = result.ans;
        attempts++;
    } while (usedQuestions.has(getQuestionHash(q)) && attempts < maxAttempts);
    
    usedQuestions.add(getQuestionHash(q));
    return { q, ans };
}

function generateQuestionAttempt(level) {
    let q = "";
    let ans = 0;

    // Class 1-2: Basic Arithmetic (HARDER)
    if (level <= 2) {
        const a = getRandomInt(10, 50);
        const b = getRandomInt(10, 50);
        const ops = ['+', '-'];
        const op = ops[getRandomInt(0, 1)];

        if (op === '+') {
            q = `${a} + ${b}`;
            ans = a + b;
        } else {
            if (a >= b) {
                q = `${a} - ${b}`;
                ans = a - b;
            } else {
                q = `${b} - ${a}`;
                ans = b - a;
            }
        }
    }

    // Class 3-4: Multiplication, Division (HARDER)
    else if (level <= 4) {
        const type = getRandomInt(1, 4);
        if (type === 1) { // Harder Multiplication
            const a = getRandomInt(11, 25);
            const b = getRandomInt(11, 25);
            q = `${a} × ${b}`;
            ans = a * b;
        } else if (type === 2) { // Division with remainders
            const b = getRandomInt(7, 15);
            ans = getRandomInt(8, 20);
            const a = b * ans;
            q = `${a} ÷ ${b}`;
        } else if (type === 3) { // Squares of larger numbers
            const a = getRandomInt(11, 20);
            q = `${a}² (Square of ${a})`;
            ans = a * a;
        } else { // Mixed operations
            const a = getRandomInt(5, 15);
            const b = getRandomInt(2, 10);
            const c = getRandomInt(1, 10);
            q = `${a} × ${b} + ${c}`;
            ans = (a * b) + c;
        }
    }

    // Class 5-6: Algebra, Complex Arithmetic (HARDER)
    else if (level <= 6) {
        const type = getRandomInt(1, 4);
        if (type === 1) { // Complex Algebra
            const x = getRandomInt(5, 20);
            const a = getRandomInt(5, 15);
            const b = getRandomInt(10, 30);
            q = `If x = ${x}, what is ${a}x + ${b}?`;
            ans = (a * x) + b;
        } else if (type === 2) { // Equation with larger numbers
            const a = getRandomInt(3, 8);
            const b = getRandomInt(10, 40);
            const x = getRandomInt(5, 15);
            const c = (a * x) - b;
            q = `Solve for x: ${a}x - ${b} = ${c}`;
            ans = x;
        } else if (type === 3) { // Average of 5 numbers
            const nums = [getRandomInt(10, 50), getRandomInt(10, 50), getRandomInt(10, 50), getRandomInt(10, 50), getRandomInt(10, 50)];
            const sum = nums.reduce((a, b) => a + b, 0);
            ans = Math.floor(sum / 5);
            q = `Average of ${nums.join(', ')}`;
        } else { // LCM concept
            const a = getRandomInt(6, 15);
            const b = getRandomInt(4, 10);
            q = `${a} × ${b} - ${a}`;
            ans = (a * b) - a;
        }
    }

    // Class 7-8: Integers, Percentages, Geometry (HARDER)
    else if (level <= 8) {
        const type = getRandomInt(1, 4);
        if (type === 1) { // Complex Integer Arithmetic
            const a = getRandomIntWithNeg(-30, 30);
            const b = getRandomIntWithNeg(-30, 30);
            const ops = ['+', '-'];
            const op = ops[getRandomInt(0, 1)];
            if (op === '+') {
                q = `${a} + (${b})`;
                ans = a + b;
            } else {
                q = `${a} - (${b})`;
                ans = a - b;
            }
        } else if (type === 2) { // Complex Percentage
            const x = getRandomInt(100, 500);
            const p = getRandomInt(10, 90);
            q = `${p}% of ${x}`;
            ans = Math.floor((p * x) / 100);
        } else if (type === 3) { // Area and Perimeter
            const l = getRandomInt(10, 25);
            const w = getRandomInt(10, 25);
            const choice = getRandomInt(0, 1);
            if (choice === 0) {
                q = `Area of rectangle: length ${l}, width ${w}`;
                ans = l * w;
            } else {
                q = `Perimeter of rectangle: length ${l}, width ${w}`;
                ans = 2 * (l + w);
            }
        } else { // Power calculations
            const a = getRandomInt(3, 7);
            q = `${a}³ (Cube of ${a})`;
            ans = a * a * a;
        }
    }

    // Class 9-10: Advanced Math (HARDER)
    else {
        const type = getRandomInt(1, 5);
        if (type === 1) { // Quadratic - Sum of roots
            const r1 = getRandomInt(-8, 8);
            const r2 = getRandomInt(-8, 8);
            const b = -(r1 + r2);
            const c = r1 * r2;
            const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
            q = `Sum of roots: x² ${signB}x ${signC} = 0`;
            ans = r1 + r2;
        } else if (type === 2) { // Quadratic - Product of roots
            const r1 = getRandomInt(-8, 8);
            const r2 = getRandomInt(-8, 8);
            const b = -(r1 + r2);
            const c = r1 * r2;
            const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
            q = `Product of roots: x² ${signB}x ${signC} = 0`;
            ans = r1 * r2;
        } else if (type === 3) { // Slope calculation
            const x1 = getRandomInt(-10, 10);
            const y1 = getRandomInt(-10, 10);
            const x2 = getRandomInt(-10, 10);
            const y2 = getRandomInt(-10, 10);
            if (x2 !== x1) {
                const m = (y2 - y1) / (x2 - x1);
                if (Number.isInteger(m)) {
                    q = `Slope: (${x1},${y1}) to (${x2},${y2})`;
                    ans = m;
                } else {
                    // Fallback to simpler calculation
                    const a = getRandomInt(2, 8);
                    q = `${a}⁴ (${a} to the power 4)`;
                    ans = a * a * a * a;
                }
            } else {
                const a = getRandomInt(2, 8);
                q = `${a}⁴ (${a} to the power 4)`;
                ans = a * a * a * a;
            }
        } else if (type === 4) { // Distance formula result squared
            const x1 = getRandomInt(0, 10);
            const y1 = getRandomInt(0, 10);
            const x2 = getRandomInt(0, 10);
            const y2 = getRandomInt(0, 10);
            const distSq = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
            q = `Distance² between (${x1},${y1}) and (${x2},${y2})`;
            ans = distSq;
        } else { // Arithmetic progression
            const a = getRandomInt(5, 15);
            const d = getRandomInt(2, 8);
            const n = getRandomInt(5, 10);
            q = `AP: a=${a}, d=${d}. Find ${n}th term`;
            ans = a + (n-1)*d;
        }
    }

    return { q, ans };
}

// --- Game Logic ---

function startQuiz(level) {
    currentLevel = level;
    score = 0;
    questionCount = 0;
    usedQuestions.clear(); // Reset used questions

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
    optionsContainer.innerHTML = '';

    // Update progress
    const progress = (questionCount / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `Question ${questionCount}/${totalQuestions}`;

    // Generate new question
    const problem = generateQuestion(currentLevel);
    questionText.innerText = problem.q;
    correctAnswer = problem.ans;

    // Generate Options (1 correct, 3 wrong)
    let answers = new Set();
    answers.add(correctAnswer);

    while (answers.size < 4) {
        let wrong;
        if (typeof correctAnswer === 'number') {
            // Generate wrong answers based on correct answer range
            const range = Math.max(Math.abs(correctAnswer) * 0.3, 10);
            wrong = correctAnswer + getRandomInt(-range, range);
            if (wrong === correctAnswer) {
                wrong += getRandomInt(5, 15);
            }
            answers.add(Math.floor(wrong));
        } else {
            answers.add(getRandomInt(1, 100));
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
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedValue == correctAnswer) {
        btn.classList.add('correct');
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    } else {
        btn.classList.add('wrong');
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
    
    // Display user info
    document.getElementById('result-name').innerText = userData.name;
    document.getElementById('result-class').innerText = userData.class;
    document.getElementById('result-gender').innerText = userData.gender;
    
    // Display final score
    const percentage = Math.floor((score / totalQuestions) * 100);
    document.getElementById('final-score').innerText = `${score}/${totalQuestions}`;
    document.getElementById('percentage').innerText = `${percentage}%`;

    // Handle top score
    const topScoreData = getTopScore();
    updateTopScore(score, userData.name, userData.class, userData.gender);
    displayScoreComparison(score, topScoreData);

    // Feedback
    const feedback = document.getElementById('feedback-text');
    if(score === totalQuestions) feedback.innerText = "Perfect Score! You're a Math Genius! 🌟";
    else if(score >= 25) feedback.innerText = "Outstanding! Excellent work! 🏆";
    else if(score >= 20) feedback.innerText = "Great Job! Keep it up! 👍";
    else if(score >= 15) feedback.innerText = "Good effort! You're improving! 💪";
    else feedback.innerText = "Keep practicing! You can do better! 📚";
}

// --- LocalStorage for Top Scores ---

function getTopScore() {
    const stored = localStorage.getItem('mathQuizTopScore');
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

function updateTopScore(currentScore, name, userClass, gender) {
    const topScore = getTopScore();
    
    if (!topScore || currentScore > topScore.score) {
        const newTopScore = {
            score: currentScore,
            name: name,
            class: userClass,
            gender: gender,
            date: new Date().toLocaleDateString()
        };
        localStorage.setItem('mathQuizTopScore', JSON.stringify(newTopScore));
    }
}

function displayScoreComparison(currentScore, topScoreData) {
    const topScoreElement = document.getElementById('top-score');
    const topScorerElement = document.getElementById('top-scorer');
    const comparisonElement = document.getElementById('comparison-text');
    
    if (topScoreData) {
        topScoreElement.innerText = `${topScoreData.score}/${totalQuestions}`;
        topScorerElement.innerText = `${topScoreData.name} (Class ${topScoreData.class})`;
        
        const difference = currentScore - topScoreData.score;
        if (difference > 0) {
            comparisonElement.innerText = `🎉 New Record! +${difference} points!`;
            comparisonElement.style.color = '#11998e';
        } else if (difference === 0) {
            comparisonElement.innerText = `🤝 Matched the top score!`;
            comparisonElement.style.color = '#667eea';
        } else {
            comparisonElement.innerText = `${Math.abs(difference)} points behind`;
            comparisonElement.style.color = '#f5576c';
        }
    } else {
        topScoreElement.innerText = `${currentScore}/${totalQuestions}`;
        topScorerElement.innerText = `${userData.name} (You!)`;
        comparisonElement.innerText = `🌟 First record set!`;
        comparisonElement.style.color = '#11998e';
    }
}

// --- Timer Logic (60 seconds) ---
let timeLeft = 60;

function startTimer() {
    timeLeft = 60; // 60 seconds (1 minute) per question
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

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

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
}