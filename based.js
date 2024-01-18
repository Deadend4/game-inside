const queryParameters = location.search.substring(1).split('&');
const mode = queryParameters[0].split('=')[1];
const numberOfQuestions = queryParameters[1].split('=')[1];
let generatorGame;
getQuestions(mode, numberOfQuestions).then((value) => {
  generatorGame = startGame(value);
  generatorGame.next();
});

async function getQuestions(gameMode = 'easy', numberOfQuestions = 10) {
  const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=15&difficulty=${gameMode}&type=multiple`;
  const response = await fetch(url);
  if (response.ok) {
    const questions = (await response.json()).results;
    const newQuestions = questions.map((item) => {
      let answers = [item.correct_answer, ...item.incorrect_answers];
      shuffle(answers);
      return { ...item, answers };
    });
    console.log(newQuestions);
    return newQuestions;
  } else {
    alert('Кажется, что-то пошло не так. Код ошибки: ' + response.status);
    return null;
  }
}
function* startGame(response) {
  const main = document.querySelector('.main-content');
  // main.classList.add('game-block');
  let roundScore = 0;
  const userAnswers = [];
  for (let i = 0; i < numberOfQuestions; i++) {
    while (main.lastElementChild) {
      main.removeChild(main.lastElementChild);
    }
    let divQuestion = document.createElement('div');
    divQuestion.classList.add('game-block');
    main.append(divQuestion);
    let questionNumber = document.createElement('p');
    questionNumber.classList.add('question-number');
    questionNumber.innerHTML = `Question #${i + 1}`;
    divQuestion.append(questionNumber);
    let questionHTML = document.createElement('p');
    questionHTML.innerHTML = response[i].question;
    divQuestion.append(questionHTML);
    let div = document.createElement('div');
    div.classList.add('buttons-line');
    divQuestion.append(div);
    let answersHTML = [];
    response[i].answers.forEach((item) => {
      answersHTML = document.createElement('button');
      answersHTML.innerHTML = item;
      answersHTML.classList.add('answer-button');
      answersHTML.addEventListener('click', () => {
        generatorGame.next(item);
      });
      div.append(answersHTML);
    });
    if (response[i].correct_answer == (userAnswers[i] = yield 'wait')) {
      roundScore++;
    }
  }
  while (main.lastElementChild) {
    main.removeChild(main.lastElementChild);
  }
  main.classList.remove('game-block');
  main.classList.add('result-block');

  let correctAnswersCount = 0;

  const totalScoreLabel = document.createElement('p');

  totalScoreLabel.innerHTML = `Total Score: ${roundScore}`;
  totalScoreLabel.classList.add('total-score');

  main.append(totalScoreLabel);

  userAnswers.forEach((item, index) => {
    let answerBlock = document.createElement('div');
    answerBlock.classList.add('answer-block');
    main.append(answerBlock);

    let question = document.createElement('p');
    let uAnswer = document.createElement('p');
    uAnswer.classList.add('result-answer');

    if (item === response[index].correct_answer) {
      question.classList.add('result-question');
      uAnswer.innerHTML = `Your answer: ${item} ✔`;
      correctAnswersCount++;
    } else {
      question.classList.add('wrong-result-question');
      uAnswer.innerHTML = `Your answer: ${item} ✖`;
    }

    question.innerHTML = `${index + 1}. ${response[index].question}`;

    answerBlock.append(question);
    uAnswer.classList.add('result-answer');
    answerBlock.append(uAnswer);

    let rAnswer = document.createElement('p');
    rAnswer.classList.add('result-answer');
    rAnswer.innerHTML = `Correct answer: ${response[index].correct_answer}`;
    answerBlock.append(rAnswer);
  });
  const divButton = document.createElement('div');
  divButton.classList.add('row-flex');
  main.append(divButton);
  const tryAgain = document.createElement('button');
  tryAgain.innerHTML = 'Try Again';
  tryAgain.classList.add('answer-button');
  tryAgain.addEventListener('click', () => {
    location.reload();
  });
  divButton.append(tryAgain);
  const mainMenu = document.createElement('a');
  mainMenu.innerHTML = 'Main Menu';
  mainMenu.classList.add('answer-button');
  mainMenu.href = '/';
  divButton.append(mainMenu);

  if (
    response[0].difficulty !== 'hard' &&
    correctAnswersCount / numberOfQuestions >= 0.5
  ) {
    const nextLevel = document.createElement('button');
    nextLevel.innerHTML = 'Next Level';
    nextLevel.classList.add('answer-button');
    switch (response[0].difficulty) {
      case 'easy':
        nextLevel.addEventListener('click', () => {
          getQuestions('medium', numberOfQuestions).then((value) => {
            const newUrl = `playground.html?modes=medium&questions=${numberOfQuestions}`;
            window.history.pushState(newUrl, 'Game', newUrl);
            generatorGame = startGame(value);
            generatorGame.next();
          });
        });
        break;
      case 'medium':
        nextLevel.addEventListener('click', () => {
          getQuestions('hard', numberOfQuestions).then((value) => {
            const newUrl = `playground.html?modes=hard&questions=${numberOfQuestions}`;
            window.history.pushState(newUrl, 'Title', newUrl);
            generatorGame = startGame(value);
            generatorGame.next();
          });
        });
        break;

      default:
        break;
    }
    divButton.append(nextLevel);
  }

  let globalScore = localStorage.getItem('globalScore');
  localStorage.setItem(
    'globalScore',
    isNaN(globalScore) ? roundScore : +globalScore + roundScore
  );
  const globalStat = localStorage.getItem('globalStat');
  const objStat = {
    difficulty: response[0].difficulty,
    'number-of-questions': numberOfQuestions,
    roundScore: roundScore,
  };
  console.log(`objStat: ${objStat}`);
  console.log(`globalStat 1: ${globalStat}`);
  if (globalStat === null) {
    localStorage.setItem('globalStat', JSON.stringify([objStat]));
    console.log(`globalStat 2: ${localStorage.getItem('globalStat')}`);
  } else {
    let jsonStat = JSON.parse(globalStat);
    if (jsonStat.length === 10) {
      jsonStat.pop();
    }
    jsonStat.unshift(objStat);
    localStorage.setItem('globalStat', JSON.stringify(jsonStat));
    console.log(`globalStat 3: ${localStorage.getItem('globalStat')}`);
  }
  return roundScore;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function compareDifficulty(a, b) {
  if (a.difficulty === 'easy') return -1;
  if (a.difficulty === 'hard') return 1;
  if (a.difficulty === 'medium' && b.difficulty === 'easy') {
    return 1;
  } else if (a.difficulty === 'medium' && b.difficulty === 'hard') {
    return -1;
  } else {
    return 0;
  }
}
