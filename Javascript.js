function initializeQuizPage() {
  let quizTitleElement = document.getElementById("quiz-title");
  let quizTitle = sessionStorage.getItem("QuizTitle"); // retrieves data from browser
  quizTitleElement.textContent = quizTitle;
  let questionCount = document.getElementById("question-count");
  let nextbtn = document.getElementById("next");
  let prevbtn = document.getElementById("previous");
  let resetbtn = document.getElementById("resetbtn");
  let userAnswers = []; //stores Users choices
  let count = 0;
  // Load possible answers from session storage
  let qAndA = JSON.parse(sessionStorage.getItem("QuestionWithAnswers")); // Converts string back into an array of Qs and As

  function displayQuestion(){
    questionCount.textContent = "Question " + (count + 1);
    let questionTitleElement = document.getElementsByClassName("question-title");
    if (questionTitleElement.length > 0) {
      questionTitleElement[0].textContent = qAndA[count].question; //gets question from the object

      let possibleAnswerTitle = Array.from(document.getElementsByClassName("option-title"));
      let possibleAnswers = qAndA[count].answers; //gets answers for the current question
      possibleAnswerTitle.forEach((element, index) => {
        element.textContent = possibleAnswers[index];
      });
    }
  }

  function scoreCalculation() { //calculates the score
    let correctAnswers = JSON.parse(sessionStorage.getItem("CorrectAnswers")); //brings the correct answers 
    let score = 0;
    //Compares users answer with the right answer
    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        score++;
      }
    });
    alert(`You got ${score} out of ${correctAnswers.length} right`);
  }

  displayQuestion();
 let submitbtn = document.getElementById("submit-quiz-btn")
  submitbtn.addEventListener("click", function () {
      scoreCalculation();
  });
  resetbtn.addEventListener("click", function () {
    //reloads the page
    location.reload();
  });

  nextbtn.addEventListener("click", function () {
    let selectedAnswer = document.querySelector('input[name="question"]:checked');
    if (selectedAnswer) {
      let label = document.querySelector(`label[for="${selectedAnswer.id}"]`);
      userAnswers[count] = label.textContent; // Store selected user answer
    }
    if (count < qAndA.length - 1) {
      count++;
      displayQuestion();
    } else {
      alert("You Completed the test");
    }
  });

  prevbtn.addEventListener("click", function () {
    if (count <= 0) {
      alert("You are at the beginning of the quiz");
    } else {
      count--;
      displayQuestion();
    }
  });
}

function initializeQuestionPage() {
let add_button_container = document.querySelector('.question-container');

// Attach listener for initial "Add Answer Choice" button
let firstAnswerChoiceBtn = document.querySelector('.answer-choice-btn');
if (firstAnswerChoiceBtn) {
  firstAnswerChoiceBtn.addEventListener('click', addAnswerChoice);
}

// Function to attach event listener to newly added answer choice buttons
function attachAnswerChoiceListener() {
  let allAnswerChoiceButtons = document.querySelectorAll('.answer-choice-btn');
  allAnswerChoiceButtons.forEach((button) => {
    button.addEventListener('click', addAnswerChoice);
  });
}

// Handles adding new answer choice
function addAnswerChoice(event) {
  let answerList = event.target.closest('.question-block').querySelector('.answer-list');
  let li = document.createElement('li');
  li.innerHTML = `
    <div class="input-wrapper">
      <input class="possibleAnswer" type="text" placeholder="Type answer here" />
      <button class='btn correct-btn'>Select as correct</button>
    </div>`;
  answerList.appendChild(li);
}

// Event listener for the "Add New Question" button
let new_question_button = document.getElementById('new-question-btn');
new_question_button.addEventListener('click', function () {
  let newQuestionId = `question-${document.querySelectorAll('.question-block').length + 1}`;
  let questionBlock = `
    <div class="question-block" id="${newQuestionId}">
     <input class="question" type="text" placeholder="Type Question Here" />
            <ul class="answer-list">
                <li>
                    <div class="input-wrapper">
                        <input class="possibleAnswer" type="text" placeholder="Type answer here" />
                        <button class="btn correct-btn">Select as correct</button>
                    </div>
                </li>
                <li>
                    <div class="input-wrapper">
                        <input class="possibleAnswer" type="text" placeholder="Type answer here" />
                        <button class="btn correct-btn">Select as correct</button>
                    </div>
                </li>
            </ul>
            <button class="add_buttons answer-choice-btn">
                <ion-icon name="add-circle-outline"></ion-icon>
            </button>
    </div>
  `;

  add_button_container.insertAdjacentHTML('afterbegin', questionBlock);

  // Re-attach event listener for newly added "Add Answer Choice" buttons
  attachAnswerChoiceListener();
});

// Delegated event listener for all correct buttons
document.body.addEventListener('click', function (event) {
  if (event.target && event.target.classList.contains("correct-btn")) {
    correct_btn_clicked(event.target); // Handle correct button click
  }
});

function correct_btn_clicked(button) {
  if (button.isGreen === undefined) {
    button.isGreen = true;
  }
  button.style.backgroundColor = button.isGreen ? 'rgb(52, 235, 82)' : 'hsl(0, 0%, 73%)';
  button.style.border = button.isGreen ? '2px solid rgb(52, 235, 82)' : '2px solid hsl(0, 0%, 0%)';
  button.style.color = 'black';
  button.isGreen = !button.isGreen;
}

let submitbtn = document.getElementById("submit-quiz-btn");

submitbtn.addEventListener("click", function (e) {
  e.preventDefault();
  let buttons = document.querySelectorAll('.correct-btn');
  let correct_buttons = [];
  let correct_answers = [];
  let questionsWithAnswers = [];

  buttons.forEach((button) => {
    if (button.style.backgroundColor === 'rgb(52, 235, 82)') {
      correct_buttons.push(button);
      let correct_answer_text = button.previousElementSibling.value;
      correct_answers.push(correct_answer_text);
    }
  });

  let questionTitleElement = document.getElementsByClassName("question");
  let quizTitleElement = document.getElementById("title");
  Array.from(questionTitleElement).forEach((questionElement, index) => {
    let questionText = questionElement.value;
    let possibleAnswerElements = questionElement.closest(".question-block").querySelectorAll(".possibleAnswer");
    let possibleAnswers = Array.from(possibleAnswerElements).map(element => element.value);
    
    questionsWithAnswers.push({
      question: questionText,
      answers: possibleAnswers
    });
  });

  let quizTitle = quizTitleElement.value;
  sessionStorage.setItem("QuestionWithAnswers", JSON.stringify(questionsWithAnswers));
  sessionStorage.setItem("CorrectAnswers", JSON.stringify(correct_answers));
  sessionStorage.setItem("QuizTitle", quizTitle);
  window.location.href = "Quizpage.html";
});
}

document.addEventListener("DOMContentLoaded", function () {
if (document.getElementById("questionAddlink")) {
  initializeQuizPage();
} else if (document.getElementById("quizAddLink")) {
  initializeQuestionPage();
}
});
