const vocabData = {};
let fileIndex = 1;
while (true) {
    try {
        const response = await fetch(`./src/vocab/unit_${fileIndex}.json`);
        if (!response.ok) break;
        const data = await response.json();
        Object.assign(vocabData, data);
        fileIndex++;
    } catch (e) {
        break;
    }
}

let currentUnit = null;
let wordsQueue = [];
let currentWord = null;
let score = 0;

const screens = {
    setup: document.getElementById('unit-selection'),
    practice: document.getElementById('flashcard-practice')
};

let flipFrontBack = false;

const dom = {
    unitSelect: document.getElementById('unit-select'),
    startBtn: document.getElementById('start-btn'),
    currentUnitTitle: document.getElementById('current-unit-title'),
    flipBtn: document.getElementById('flip-btn'),
    questionText: document.getElementById('question-text'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    feedbackMsg: document.getElementById('feedback-msg'),
    score: document.getElementById('score'),
    ttsBtn: document.getElementById('tts-btn'),
};

// Populate the unit select dropdown dynamically from vocab.json
dom.unitSelect.innerHTML = '';
for (const [key, data] of Object.entries(vocabData)) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = data.title;
    dom.unitSelect.appendChild(option);
}

dom.startBtn.addEventListener('click', () => {
    const selected = dom.unitSelect.value;
    currentUnit = vocabData[selected];
    wordsQueue = [...currentUnit.words].sort(() => Math.random() - 0.5);
    score = 0;
    
    dom.currentUnitTitle.textContent = currentUnit.title;
    screens.setup.style.display = 'none';
    screens.practice.style.display = 'block';
    
    nextWord();
});

function nextWord() {
    dom.answerInput.value = '';
    dom.feedbackMsg.textContent = '';
    
    if (wordsQueue.length === 0) {
        dom.questionText.textContent = "Unit complete!";
        dom.answerInput.style.display = 'none';
        dom.submitBtn.textContent = 'Back to Menu';
        currentWord = null;
        return;
    }
    currentWord = wordsQueue.pop();
    dom.questionText.textContent = flipFrontBack ? currentWord.a : currentWord.q;
    dom.answerInput.focus();
}

function checkAnswer() {
    if (!currentWord) {
        // Back to menu
        screens.setup.style.display = 'block';
        screens.practice.style.display = 'none';
        dom.answerInput.style.display = 'inline-block';
        dom.submitBtn.textContent = 'Check';
        return;
    }

    const answer = dom.answerInput.value.trim().toLowerCase();
    const correctAnswer = (flipFrontBack ? currentWord.q : currentWord.a).toLowerCase();
    
    if (answer === correctAnswer) {
        dom.feedbackMsg.textContent = "Correct!";
        dom.feedbackMsg.className = "correct";
        score++;
        dom.score.textContent = "Score: " + score;
        setTimeout(nextWord, 1000);
    } else {
        dom.feedbackMsg.textContent = "Incorrect. The answer is: " + (flipFrontBack ? currentWord.q : currentWord.a);
        dom.feedbackMsg.className = "incorrect";
        // Put back in queue to retry later
        wordsQueue.unshift(currentWord);
        setTimeout(nextWord, 2000);
    }
}

dom.submitBtn.addEventListener('click', checkAnswer);
dom.answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

dom.flipBtn.addEventListener('click', () => {
    flipFrontBack = !flipFrontBack;
    if (currentWord) {
        dom.questionText.textContent = flipFrontBack ? currentWord.a : currentWord.q;
    }
});

dom.ttsBtn.addEventListener('click', () => {
    if (!currentWord) return;
    const utterance = new SpeechSynthesisUtterance(flipFrontBack ? currentWord.a : currentWord.q);
    utterance.lang = currentUnit.languageRegex; // Note: might not be perfectly matched when reversed depending on data
    speechSynthesis.speak(utterance);
});
