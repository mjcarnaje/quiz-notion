const dataController = (() => {
  const data = {
    questions: [],
    questionsLeft: [],
    questionsAnswered: [],
    currentQuestion: null,
    currentIndex: 0,
    score: 0,
  };

  return {
    getQuestions: async () => {
      const response = await fetch("http://localhost:4000/questions");
      const responseJSON = await response.json();
      data.questions = [...responseJSON];
      data.currentQuestion = data.questions[data.currentIndex];
      data.questionsLeft = [
        ...data.questions.filter((x) => x.id !== data.currentQuestion.id),
      ];
    },
    resetQuiz: () => {
      data.questions = [];
      data.questionsLeft = [];
      data.questionsAnswered = [];
      data.currentQuestion = null;
      data.currentIndex = 0;
      data.score = 0;
    },
    getQuestion: () => data.currentQuestion,
    nextQuestion: () => {
      if (data.currentIndex === data.questions.length - 1) {
        data.currentQuestion = null;
      } else {
        data.currentIndex += 1;
        data.questionsLeft = [
          data.questionsLeft.filter((x) => x.id !== data.currentQuestion.id),
        ];
        data.currentQuestion = data.questions[data.currentIndex];
      }
    },
    checkAnswer: ({ selected }) => {
      let correct;

      if (data.currentQuestion.answer.id == selected) {
        correct = true;
        data.score += 10;
      } else {
        correct = false;
      }

      data.questionsAnswered.push({
        quizId: data.currentQuestion.id,
        userAnswer: selected,
        correct,
      });

      return correct;
    },
    getScore: () => data.score,
    getPercentage: () =>
      ((data.score / data.questions.length) * 100).toFixed(2),
  };
})();

const UIController = (() => {
  const DOMStrings = {
    container: "container",
    startButton: "startButton",
    loadingDOM: "loading",
    choice: "choiceButton",
  };

  function disableChoices() {
    document.querySelectorAll(`.${DOMStrings.choice}`).forEach((x) => {
      x.classList.add("pointer-events-none");
    });
  }

  return {
    clearContainer: () => {
      document.getElementById(DOMStrings.container).innerHTML = "";
    },
    renderHome: () => {
      const home = `
        <div class="mb-12 text-center">
          <h1 class="text-7xl font-Inter font-extrabold  tracking-tight mb-8">Simple Quiz Application</h1>
          <p class="text-lg">Using vanilla Javascript and powered by Notion Database</p>
          <p class="text-lg">You can add any question 
            <a 
              href="https://www.notion.so/8e2058866aa74426948c660502a1e1f6?v=94df4489bb2845b988ddfe6dd3ac115d"\
              target="_blank"
              class=" transition-colors font-medium cursor-pointer text-md bg-red-500 hover:bg-red-600 hover:shadow-sm px-1 text-white rounded-sm">
              here</a>
              , just follow the format of the table.
          </p>
        </div>
        <button id="startButton"
          class="transition-colors bg-blue-500 flex items-center text-white text-md font-semibold px-5 py-2 rounded-md focus:outline-none hover:bg-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Start Quiz
          </span>
        </button>
      `;
      document.getElementById(DOMStrings.container).innerHTML = home;
    },
    renderLoading: () => {
      const spinner = `
        <div class='flex flex-col justify-center'>
          <p class="text-lg">Loading...</p>
        </div>
        `;

      document.getElementById(DOMStrings.container).innerHTML = spinner;
    },
    renderNextButton: () => {
      const nextButton = `
        <button id="nextButton"
          class="transition-colors bg-blue-500 flex items-center ml-auto text-white text-lg font-semibold px-6 py-2 rounded-md focus:outline-none hover:bg-blue-600">
            <span>
              Next
            </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      `;

      document.querySelector(".nextButtonContainer").innerHTML = nextButton;
    },
    renderQuestion: ({ question, choices, answer }) => {
      const renderChoices = (choices) =>
        choices
          .map((choice) => {
            return `<div choiceId=${choice.id} class="${DOMStrings.choice} items-center w-32 text-white text-md font-medium flex-1 py-2 px-2 flex justify-center bg-blue-500 rounded-md hover:bg-blue-600 hover:shadow-md cursor-pointer">
                  ${choice.value}
                  </div>`;
          })
          .join(" ");

      document.getElementById(DOMStrings.container).innerHTML = `
        <div class="flex flex-col gap-2">
          <h1 class='text-4xl font-semibold mb-12 text-gray-900'>${question}</h1>
          <div class="flex flex-wrap gap-2">
            ${renderChoices(choices)}
          </div>
          <div class="nextButtonContainer h-8 mt-16 flex w-full "></div>
        </div>`;
    },
    renderScorePlayAgain: ({ scorePercentage }) => {
      document.getElementById(DOMStrings.container).innerHTML = `
        <div class='w-screen h-screen grid place-items-center '>
          <div class='text-center'>
            <h2 class="text-8xl font-bold mb-12">${scorePercentage}%</h2>
            <div class='flex flex-col space-y-2'>
              <button id="playAgain"
                class="transition-colors bg-blue-500 text-white text-lg font-semibold px-6 py-2 rounded-md focus:outline-none hover:bg-blue-600">
                Next
              </button>
              <button id="goToHome"
                class="transition-colors bg-blue-500 text-white text-lg font-semibold px-6 py-2 rounded-md focus:outline-none hover:bg-blue-600">
                Home
              </button>
            </div>
          </div>
        </div>
      `;
    },
    checkAnswer: ({ answerId, selected, correct }) => {
      disableChoices();
      if (correct) {
        const choiceDOM = document.querySelector(`[choiceId="${selected}"]`);
        choiceDOM.classList.add("bg-green-500");
        choiceDOM.classList.add("text-white");
        choiceDOM.classList.remove("bg-blue-500");
        choiceDOM.classList.remove("hover:bg-blue-600");

        const checkIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>`;

        choiceDOM.insertAdjacentHTML("afterbegin", checkIcon);
      } else {
        const choiceDOM = document.querySelector(`[choiceId="${selected}"]`);
        choiceDOM.classList.add("bg-red-500");
        choiceDOM.classList.add("text-white");
        choiceDOM.classList.remove("bg-blue-500");
        choiceDOM.classList.remove("hover:bg-blue-600");

        const wrongIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>`;

        choiceDOM.insertAdjacentHTML("afterbegin", wrongIcon);

        const answerDOM = document.querySelector(`[choiceId="${answerId}"]`);
        answerDOM.classList.add("bg-green-500");
        answerDOM.classList.add("text-white");
        answerDOM.classList.remove("bg-blue-500");
        answerDOM.classList.remove("hover:bg-blue-600");
      }
    },
    getDOMStrings: () => DOMStrings,
  };
})();

const controller = ((dataController, UIController) => {
  const setupEventListeners = () => {
    const DOM = UIController.getDOMStrings();

    document.getElementById(DOM.container).addEventListener("click", playAgain);
    document
      .getElementById(DOM.startButton)
      .addEventListener("click", startGame);
    document
      .getElementById(DOM.container)
      .addEventListener("click", selectAnswer);
    document
      .getElementById(DOM.container)
      .addEventListener("click", nextQuestion);
    document.getElementById(DOM.container).addEventListener("click", goToHome);
  };

  async function startGame() {
    UIController.clearContainer();
    UIController.renderLoading();
    await dataController.getQuestions();
    UIController.clearContainer();
    const question = dataController.getQuestion();
    UIController.renderQuestion(question);
  }

  function selectAnswer(event) {
    if (event.target.getAttribute("choiceId")) {
      const correct = dataController.checkAnswer({
        selected: event.target.getAttribute("choiceId"),
      });

      const question = dataController.getQuestion();

      UIController.checkAnswer({
        answerId: question.answer.id,
        selected: event.target.getAttribute("choiceId"),
        correct,
      });

      UIController.renderNextButton();
    }
  }

  function nextQuestion(event) {
    if (
      event.target.getAttribute("id") === "nextButton" ||
      event.target.parentNode?.getAttribute("id") === "nextButton" ||
      event.target.parentNode.parentNode?.getAttribute("id") === "nextButton"
    ) {
      dataController.nextQuestion();
      const question = dataController.getQuestion();
      const scorePercentage = dataController.getPercentage();

      if (!question) {
        UIController.clearContainer();
        UIController.renderScorePlayAgain({ scorePercentage });
      } else {
        UIController.renderQuestion(question);
      }
    }
  }

  function playAgain(event) {
    if (event.target.getAttribute("id") === "playAgain") {
      UIController.clearContainer();
      dataController.resetQuiz();
      startGame();
    }
  }

  function goToHome(event) {
    if (event.target.getAttribute("id") === "goToHome") {
      UIController.clearContainer();
      dataController.resetQuiz();
      UIController.renderHome();
    }
  }

  return {
    init: () => {
      setupEventListeners();
    },
  };
})(dataController, UIController);

controller.init();
