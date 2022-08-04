const countSpan = document.querySelector('.count span');
const bullets = document.querySelector('.bullets');
const bulletSpanCont = document.querySelector('.bullets .spans');
const quizArea = document.querySelector('.quiz-area');
const answersArea = document.querySelector('.answers-area');
const submitBtn = document.querySelector('.submit-button');
const resultCont = document.querySelector('.results');
const countDownElement = document.querySelector('.countdown');

let rightAnswer = 0;
let currentIndex = 0;
let countDownInterval;

const getQuestions = () => {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(this.responseText);
			let questions = JSON.parse(this.responseText);
			let qCount = questions.length;
			createBullets(qCount);
			addQuestionData(questions[currentIndex], qCount);

			countDown(15, qCount);

			submitBtn.onclick = () => {
				let rightAnswer = questions[currentIndex].right_answer;
				currentIndex++;
				checkAnswer(rightAnswer, qCount);

				quizArea.innerHTML = '';
				answersArea.innerHTML = '';
				addQuestionData(questions[currentIndex], qCount);
				bulletsHandler();
				clearInterval(countDownInterval);
				countDown(15, qCount);
				displayResult(qCount);
			}
    }
  }
  request.open("GET", "html_questions.json", true);
  request.send();
}

getQuestions();

const createBullets = (num) => {
	countSpan.innerHTML = num;

	for (let i = 0; i < num; i++) {
		let bullet = document.createElement('span');
		if (i === 0) {
			bullet.className = "on";
		}
		bulletSpanCont.appendChild(bullet);
	}
}

const addQuestionData = (obj, count) => {
	if (currentIndex < count) {
		let qTitle = document.createElement('h2');
		let qText = document.createTextNode(obj.title);
		qTitle.appendChild(qText);
		quizArea.appendChild(qTitle);

		for (let i = 1; i <= 4; i++) {
			let mainDiv = document.createElement('div');
			mainDiv.className = 'answer';

			let radioInpt = document.createElement('input');
			radioInpt.name = 'question';
			radioInpt.type = 'radio';
			radioInpt.id = `radio_${i}`;
			radioInpt.dataset.answer = obj[`answer_${i}`];

			if (i === 1) {
				radioInpt.checked = true;
			}

			let label = document.createElement('label');
			label.htmlFor = `answer_${i}`;
			let labelText = document.createTextNode(obj[`answer_${i}`]);
			label.appendChild(labelText);
			mainDiv.appendChild(radioInpt);
			mainDiv.appendChild(label);

			answersArea.appendChild(mainDiv);
		}
	}
}

const checkAnswer = (rAnswer, count) => {
	let answers = document.getElementsByName('question');
	let choosenAnswer;
	for (let i = 0; i < answers.length; i++) {
		if (answers[i].checked) {
			choosenAnswer = answers[i].dataset.answer;
		}
	}
	if (rAnswer === choosenAnswer) {
		rightAnswer++;
	}
}

const bulletsHandler = () => {
	const bulletsSpans = document.querySelectorAll('.bullets .spans span');
	let arrOfSpans = Array.from(bulletsSpans);
	arrOfSpans.forEach((span, index) => {
		if (currentIndex === index) {
			span.className = 'on';
		}
	});
}

const displayResult = (count) => {
	let result;
	if (currentIndex === count) {
		quizArea.remove();
		answersArea.remove();
		submitBtn.remove();
		bullets.remove();

		if (rightAnswer > count / 2  && rightAnswer < count) {
			result = `<span class="good">Good</span>, ${rightAnswer} From ${count} is right.`;
		} else if (rightAnswer === count) {
			result = `<span class="perfect">Perfect</span>, all answers is right.`;
		} else {
			result = `<span class="bad">Bad</span>, ${rightAnswer} From ${count} is right.`;
		}
		resultCont.innerHTML = result;
		resultCont.style.padding = '10px';
		resultCont.style.marginTop = '10px';
		resultCont.style.backgroundColor = '#fff';
	}
}

const countDown = (duration, count) => {
	if (currentIndex < count) {
		let minutes, seconds;
		countDownInterval = setInterval(() => {
			minutes = parseInt(duration / 60);
			seconds = parseInt(duration % 60);

			minutes = minutes < 10 ? `0${minutes}` : minutes;
			seconds = seconds < 10 ? `0${seconds}` : seconds;

			countDownElement.innerHTML = `${minutes}:${seconds}`;
			if (--duration < 0) {
				clearInterval(countDownInterval);
				submitBtn.click();
			}
		}, 1000);
	}
}