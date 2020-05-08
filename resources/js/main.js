
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
  title: [],
  due: [],
  progress: [],
  difficulty: [],
  score: [],
  len: 0
};

setDeadlineFieldDefault();
renderTodoList();

// User clicks the add button
document.getElementById('add').addEventListener('click', function() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var yyyymmdd = parseInt(yyyy+mm+dd);

  var title = document.getElementById('title').value.trim();
  var due = document.getElementById('due').value;
  var progress = parseFloat(document.getElementById('progress').value);
  var difficulty = parseFloat(document.getElementById('difficulty').value);

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

  // if locked from editing session, unlock
  document.getElementById('difficulty').disabled = false;
  document.getElementById('difficulty').classList.remove('lock');
});

// Pressing the Enter key triggers an 'add' event
document.querySelectorAll('input').forEach(item => {
  item.addEventListener('keydown', function (e) {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      document.getElementById('add').click();
      document.getElementById('title').focus();
      document.getElementById('title').select();
    }
  })
});

function setDeadlineFieldDefault () {
  // set deadline field default value to today's date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var yyyymmdd = yyyy+"-"+mm+"-"+dd;
  document.getElementById('due').defaultValue = yyyymmdd;
}

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
  if (!data.len) {
    document.getElementById('headerRow').style.display = 'none';
    return;
  } else {
    document.getElementById('headerRow').style.display = 'flex';
  }

  var list = document.getElementById('todo');
  list.innerHTML = ''; // clear list momentarily

  sortData();

  for (var i = 0; i < data.len; ++i) {
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

function editItem() {
  window.scrollTo(0,0); // scroll to top so user can edit params

  var item = this.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.firstChild.textContent;

  index_of_data = data.title.indexOf(value);
  title = data.title[index_of_data];
  due = data.due[index_of_data];
  progress = data.progress[index_of_data];
  difficulty = data.difficulty[index_of_data];
  score = data.score[index_of_data];

  // remove data - potential issue when user edits but doesn't save again - results in loss
  data.title.splice(index_of_data, 1);
  data.due.splice(index_of_data, 1);
  data.progress.splice(index_of_data, 1);
  data.difficulty.splice(index_of_data, 1);
  data.score.splice(index_of_data, 1);
  --data.len;

  var titleInput = document.getElementById('title');
  titleInput.value = title;

  var dueInput = document.getElementById('due');
  dueInput.value = due;

  var progressInput = document.getElementById('progress');
  progressInput.value = progress;

  var difficultyInput = document.getElementById('difficulty');
  difficultyInput.value = difficulty;
  difficultyInput.disabled = true; // disable changing difficulty level
  difficultyInput.classList.add('lock'); // add fancy cursor

  dataObjectUpdated(); // update cookie

  parent.removeChild(item); // removal - could be problematic
};

function removeItem() {
  var item = this.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.firstChild.textContent;

  index_of_data = data.title.indexOf(value);
  data.title.splice(index_of_data, 1);
  data.due.splice(index_of_data, 1);
  data.progress.splice(index_of_data, 1);
  data.difficulty.splice(index_of_data, 1);
  data.score.splice(index_of_data, 1);
  --data.len;

  dataObjectUpdated();

  parent.removeChild(item);
  renderTodoList();
};

// Adds a new item to the todo list
function addItemToDOM(title, due, progress, difficulty, score) {
  var list = document.getElementById('todo');

  var item = document.createElement('div');
  item.classList.add('row');

  var item_title = document.createElement('div');
  item_title.classList.add('column');
  item_title.classList.add('column-40');
  item_title.style.paddingRight = "5%";
  item_title.innerText = title;
  item.appendChild(item_title);

  var item_due = document.createElement('div');
  item_due.classList.add('column');
  item_due.classList.add('column-25');
  item_due.innerText = due.substring(5,);
  item.appendChild(item_due);

  var item_progress = document.createElement('div');
  item_progress.classList.add('column');
  item_progress.classList.add('column-20');
  item_progress.innerText = progress;
  item.appendChild(item_progress);

  // difficulty should not be editable, so it's hidden as well - can be changed, idk
  // var item_difficulty = document.createElement('div');
  // item_difficulty.classList.add('column');
  // item_difficulty.classList.add('column-15');
  // item_difficulty.innerText = difficulty;
  // item.appendChild(item_difficulty);

  var edit = document.createElement('div');
  edit.classList.add('editButton');
  edit.innerText = "✎"; // used fancy javascript to flip this

  var remove = document.createElement('div');
  remove.classList.add('deleteButton');
  remove.innerText = "×";

  // Add click event for removing the item
  edit.addEventListener('click', editItem);
  remove.addEventListener('click', removeItem);

  item.appendChild(edit);
  item.appendChild(remove);

  list.insertBefore(item, list.firstChild);
}

function computeScore(due, progress, difficulty) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var yyyymmdd = parseInt(yyyy+mm+dd);

  var deltaDays = parseInt(due.replace("-","").replace("-","")) - yyyymmdd;

  var score = 6.0; // default value, because if delta days is < 0, the task is over due, and this indicates that

  if (deltaDays >= 0) // if task isn't overdue, use the cool formula
    score = (Math.sqrt(100 - progress) / 10) * difficulty / (Math.pow((deltaDays + 1.0), 3));

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

  var tempDue = data.due[a];
  data.due[a] = data.due[b];
  data.due[b] = tempDue;

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

