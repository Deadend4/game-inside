const queryParameters = location.search.substring(1).split("&");
const mode = queryParameters[0].split("=")[1];
const numberOfQuestions = queryParameters[1].split("=")[1];
let generatorGame;
getQuestions(mode, numberOfQuestions).then((value) => {
  generatorGame = startGame(value)
  generatorGame.next()
});

async function getQuestions(gameMode = "easy", numberOfQuestions = 10) {
  const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=15&difficulty=${gameMode}&type=multiple`;
  const response = await fetch(url);
  if (response.ok) {
    const questions = (await response.json()).results;
    const newQuestions = questions.map(item => {
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
  const main = document.querySelector(".main-content");
  main.classList.add("game-block");
  let roundScore = 0;
  const userAnswers = [];
  for (let i = 0; i < numberOfQuestions; i++) {
    while (main.lastElementChild) {
      main.removeChild(main.lastElementChild);
    }
    let qustionNumber = document.createElement('p');
    qustionNumber.innerHTML = `Question #${i + 1}`;
    main.append(qustionNumber);
    let questionHTML = document.createElement('p');
    questionHTML.innerHTML = response[i].question;
    main.append(questionHTML);
    let div = document.createElement('div');
    div.classList.add('buttons-line');
    main.append(div);
    let answersHTML = [];
    response[i].answers.forEach(item => {
      answersHTML = document.createElement('button');
      answersHTML.innerHTML = item;
      answersHTML.classList.add('answer-button');
      answersHTML.addEventListener('click', () => {
        generatorGame.next(item);
      });
      div.append(answersHTML);
    });
    if (response[i].correct_answer == (userAnswers[i] = yield "wait")) {
      roundScore++;
    }
  }
  while (main.lastElementChild) {
    main.removeChild(main.lastElementChild);
  }
  main.classList.remove("game-block");
  main.classList.add("result-block");
  const totalScoreLabel = document.createElement('p');
  totalScoreLabel.innerHTML = `Total Score: ${roundScore}`;
  main.append(totalScoreLabel);
  for (let i = 0; i < numberOfQuestions; i++) {
    let question = document.createElement('p');
    question.classList.add("result-question");
    question.innerHTML = `${i + 1}. ${response[i].question}`;
    main.append(question);

    let uAnswer = document.createElement('p');
    uAnswer.classList.add("result-answer");
    uAnswer.innerHTML = `Your answer: ${userAnswers[i]}`;
    main.append(uAnswer);
    let rAnswer = document.createElement('p');
    rAnswer.classList.add("result-answer");
    rAnswer.innerHTML = `Correct answer: ${response[i].correct_answer}`;
    main.append(rAnswer);
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
