const main = document.querySelector('.main-content');

const globalScoreLabel = document.createElement('p');
globalScoreLabel.innerHTML = `Total Score: ${
  localStorage.getItem('globalScore') || 0
}`;
globalScoreLabel.classList.add('total-score');
main.append(globalScoreLabel);

const jsonStat = localStorage.getItem('globalStat');
const globalStat = JSON.parse(jsonStat);
const statList = document.createElement('div');
statList.classList.add('column-flex');
main.append(statList);
globalStat.forEach((item) => {
  const globalStatistics = document.createElement('p');
  globalStatistics.innerHTML = `Difficulty: ${
    item.difficulty
  } // Number of questions: ${
    item['number-of-questions']
  } // Correct answers: ${item.roundScore} // Wrong answers: ${
    item['number-of-questions'] - item.roundScore
  }`;
  if (item.roundScore / item['number-of-questions'] > 0.5) {
    globalStatistics.classList.add('correct-result-question');
  } else {
    globalStatistics.classList.add('wrong-result-question');
  }
  statList.append(globalStatistics);
});
