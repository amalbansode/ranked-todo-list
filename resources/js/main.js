
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
  title: [],
  due: [],
  progress: [],
  difficulty: [],
  score: []
};

// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

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

  if (isNaN(difficulty) || difficulty < 0 || difficulty > 5) {
    window.alert("Please enter the perceived difficulty of the task from 0-5.");
    return; // abort addition
  }

  var score = ((100 - progress) * 10) / (deltaDays * difficulty);
  score = score.toPrecision(4);

  console.log(progress);
  if (title) {
    addItem(title, due, progress, difficulty, score);
  }
});

//document.getElementById('title').addEventListener('keydown', function (e) {
//  var value = this.value;
//  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
//    addItem(value, 0, 0, 0);
//  }
//});

function addItem (title, due, progress, difficulty, score) {
  addItemToDOM(title, due, progress, difficulty, score);
  document.getElementById('title').value = '';
  document.getElementById('due').value = '';
  document.getElementById('progress').value = '';
  document.getElementById('difficulty').value = '';

  data.title.push(title);
  data.due.push(due);
  data.progress.push(progress);
  data.difficulty.push(difficulty);
  data.score.push(score);

  dataObjectUpdated();
}

function renderTodoList() {
  if (!data.title.length) return;

  for (var i = 0; i < data.title.length; i++) {
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
  var value = item.innerText;

  // if (id === 'todo') {
    data.title.splice(data.title.indexOf(value), 1);
    data.due.splice(data.due.indexOf(value), 1);
    data.progress.splice(data.progress.indexOf(value), 1);
    data.difficulty.splice(data.difficulty.indexOf(value), 1);
    data.score.splice(data.score.indexOf(value), 1);

  // } else {
    // data.title.splice(data.title.indexOf(value), 1);
  // }
  dataObjectUpdated();

  parent.removeChild(item);
}

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
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;

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
