async function startRound(numberOfQuestions = 10) {
  const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=15&type=multiple`;
  const response = await fetch(url);
  let roundScore = 0;
  if (response.ok) {
    let questions = (await response.json()).results;
    console.log(questions.sort(compareDifficulty));
    for (let i = 0; i < numberOfQuestions; i++) {
      const answers = [
        questions[i].correct_answer,
        ...questions[i].incorrect_answers,
      ];
      shuffle(answers);
      const answer = prompt(`${questions[i].question}
      1) ${answers[0]}      
      2) ${answers[1]}
      3) ${answers[2]}      
      4) ${answers[3]}`);
      if (
        (isNaN(+answer) && questions[i].correct_answer === answer) ||
        questions[i].correct_answer === answers[+answer - 1]
      ) {
        roundScore++;
        console.log(roundScore);
      }
    }
  } else {
    alert('Кажется, что-то пошло не так. Код ошибки: ' + response.status);
  }
  alert('Набрано очков за раунд: ' + roundScore);
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
startRound(3); 
