
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
  title: [],
  due: [],
  progress: [],
  difficulty: [],
  score: [],
  len: 0
};

// Remove and complete icons in SVG format
renderTodoList();

// User clicked on the add button
// If there is any text inside the item field, add that text to the todo list
document.getElementById('add').addEventListener('click', function() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var yyyymmdd = parseInt(yyyy+mm+dd);

  var title = document.getElementById('title').value.trim();
  var due = document.getElementById('due').value;
  var progress = parseInt(document.getElementById('progress').value);
  var difficulty = parseInt(document.getElementById('difficulty').value);

  var deltaDays = parseInt(due.replace("-","").replace("-","")) - yyyymmdd;
  if (deltaDays < 0) {
    window.alert("Please set the due date to today or a later date.");
    return; // abort addition
  }

  if (title.length == 0) {
    window.alert("Please enter a task title.");
    return; // abort addition
  }

  if (isNaN(progress) || progress < 0 || progress > 100) {
    window.alert("Please enter your progress so far from 0-100.");
    return; // abort addition
  }

  if (isNaN(difficulty) || difficulty < 1 || difficulty > 5) {
    window.alert("Please enter the perceived difficulty of the task from 1-5.");
    return; // abort addition
  }

  var score = parseFloat(computeScore(due, progress, difficulty));

  addItem(title, due, progress, difficulty, score);
});

//document.getElementById('title').addEventListener('keydown', function (e) {
//  var value = this.value;
//  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
//    addItem(value, 0, 0, 0);
//  }
//});

function addItem (title, due, progress, difficulty, score) {
  document.getElementById('title').value = '';
  document.getElementById('due').value = '';
  document.getElementById('progress').value = '';
  document.getElementById('difficulty').value = '';

  data.title.push(title);
  data.due.push(due);
  data.progress.push(progress);
  data.difficulty.push(difficulty);
  data.score.push(score);
  ++data.len;

  renderTodoList();
  dataObjectUpdated(); //  update cookie list now
}

function renderTodoList() {
  if (!data.len) return;

  var list = document.getElementById('todo');
  list.innerHTML = ''; // clear list momentarily

  sortData();

  for (var i = 0; i < data.len; i++) {
    var title = data.title[i];
    var due = data.due[i];
    var progress = data.progress[i];
    var difficulty = data.difficulty[i];
    var score = data.score[i];
    addItemToDOM(title, due, progress, difficulty, score);
  }
}

function dataObjectUpdated() {
  localStorage.setItem('todoList', JSON.stringify(data));
}

function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.firstChild.data;

  data.title.splice(data.title.indexOf(value), 1);
  data.due.splice(data.due.indexOf(value), 1);
  data.progress.splice(data.progress.indexOf(value), 1);
  data.difficulty.splice(data.difficulty.indexOf(value), 1);
  data.score.splice(data.score.indexOf(value), 1);
  --data.len;

  dataObjectUpdated();

  parent.removeChild(item);
};

/*function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;

  if (id === 'todo') {
    data.todo.splice(data.title.indexOf(value), 1);
    data.title.push(value);
  } else {
    data.completed.splice(data.title.indexOf(value), 1);
    data.title.push(value);
  }
  dataObjectUpdated();

  // Check if the item should be added to the completed list or to re-added to the todo list
  var target = (id === 'todo') ? document.getElementById('completed'):document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}*/

// Adds a new item to the todo list
function addItemToDOM(title, due, progress, difficulty, score) {
  var list = document.getElementById('todo');

  var item = document.createElement('li');
  // create cols for each param
  item.innerText = title;

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var remove = document.createElement('button');
  remove.classList.add('button-clear');
  remove.id = "removeItem";
  remove.innerText = "×";

  // Add click event for removing the item
  remove.addEventListener('click', removeItem);

 /* var complete = document.createElement('button');
  complete.classList.add('complete');
  complete.innerHTML = completeSVG;

  // Add click event for completing the item
  complete.addEventListener('click', completeItem);*/

  buttons.appendChild(remove);
  // buttons.appendChild(complete);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
}

function computeScore(due, progress, difficulty) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var yyyymmdd = parseInt(yyyy+mm+dd);

  var deltaDays = parseInt(due.replace("-","").replace("-","")) - yyyymmdd;

  var score = ((100 - progress) * 10) / (deltaDays * difficulty);
  score = parseFloat(score.toPrecision(4));
  return score;
}

function sortData() {
  for (var i = 0; i < data.len; ++i) {
    data.score[i] = parseFloat(computeScore(data.due[i], data.progress[i], data.difficulty[i]));
  }
  // bubble sort according to task score
  for (var i = 0; i < data.len; i++) {
      for (var j = 0; j < data.len - i - 1; j++) {
          if (data.score[j] > data.score[j + 1]) {
              swapData(j, (j + 1));
          }
      }
  }
}

function swapData(a, b) {
  var tempTitle = data.title[a];
  data.title[a] = data.title[b];
  data.title[b] = tempTitle;

  var tempProgress = data.progress[a];
  data.progress[a] = data.progress[b];
  data.progress[b] = tempProgress;

  var tempDifficulty = data.difficulty[a];
  data.difficulty[a] = data.difficulty[b];
  data.difficulty[b] = tempDifficulty;

  var tempScore = data.score[a];
  data.score[a] = data.score[b];
  data.score[b] = tempScore;
}

