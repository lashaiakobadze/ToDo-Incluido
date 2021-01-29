'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ToDo Incluido
////////////////////////////////////////////////////////////////
// Open and close modal for new item
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn-close-modal');
const btnsOpenModal = document.querySelectorAll('.btn-show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//////////////////////////////////////////////
// Create Object
let todoObjects = [];

function todoObject(ObjectName, ObjectDescription, ObjectPriority, ObjectStatus, date) {
  this.ObjectName = ObjectName;
  this.ObjectDescription = ObjectDescription;
  this.ObjectPriority = ObjectPriority;
  this.ObjectStatus = ObjectStatus;
  this.date = date
}

const btnTransfer = document.querySelector('.btn');
const inputName = document.querySelector('.todo_form_item_input');
const inputTextarea = document.querySelector('.todo_form_item_textarea');
const priority = document.querySelector('.todo_form_item_priority');
const status = document.querySelector('.todo_form_item_status');

const containerTodo = document.querySelector('.todo'); 
const containerInProgress = document.querySelector('.in-progress'); 
const containerDone = document.querySelector('.done'); 

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const output = month  + '\n'+ day  + ',' + year; 
  
  const name = inputName.value;
  const description = inputTextarea.value;
  const priorityVal = priority.value;
  const statusId = status.value;

  const newObject = new todoObject(name, description, priorityVal, statusId, output);
  
  todoObjects.push(newObject);

  // Sort objects by priority
  let byDate = todoObjects.slice(0);
  byDate.sort(function(a,b) {
      return a.ObjectPriority - b.ObjectPriority;
  });
  todoObjects = byDate;
  
  function removeChildList() {
    containerTodo.innerHTML = containerInProgress.innerHTML = containerDone.innerHTML = ""; 

    for(let i = 0; i < todoObjects.length; i++) {
      displayTodo(todoObjects[i]);
    }
  }

  removeChildList();
  mainEdit();
  kaxa();
  dragUpdate();
});

/////////////////////////////////////////////////
// Add new plan

function  displayTodo(object) {
  const html = `    
                <li class="todo_item" draggable="true">
                  <div class="todo_item_head">
                      <select name="priority" class="priority" disabled>
                          <option selected="selected">${object.ObjectPriority}</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                      </select>
                      <div class="option">
                          <select name="option_status" class="option_status hidden" disabled>
                              <option selected="selected">${object.ObjectStatus}</option>
                              <option value="1">To Do</option>
                              <option value="2">In Progress</option>
                              <option value="3">Done</option>
                          </select>

                          <span>${object.date}</span>
                          <button type="button" class="option_edit"><i class="far fa-edit"></i></button>
                          <button type="button" class="option_delete"><i class="fas fa-eraser"></i></button>
                      </div>
                  </div>

                  <div class="todo_item_content">
                      <input type="text" class="todo_item_content_input" value="${object.ObjectName}"  readonly>
                      <textarea name="" class="todo_item_content_textarea" cols="30" rows="10" readonly>${object.ObjectDescription}</textarea>
                  </div>
                </li>
              `;
    if(object.ObjectStatus == 1) containerTodo.insertAdjacentHTML('beforeend', html);
    if(object.ObjectStatus == 2) containerInProgress.insertAdjacentHTML('beforeend', html);
    if(object.ObjectStatus == 3) containerDone.insertAdjacentHTML('beforeend', html);
  // if(object.ObjectStatus == 1) containerTodo.append(html);
  // if(object.ObjectStatus == 2) containerInProgress.append(html);
  // if(object.ObjectStatus == 3) containerDone.append(html);
};


////////////////////////////////////////////////////////////////
// Delete 
let todoPlan = document.querySelectorAll('.todo_item');

function kaxa() {
  todoPlan = document.querySelectorAll('.todo_item');
  const btnDeleteOption = document.querySelectorAll('.option_delete');

  function deletePlan(e) {
    e.target.closest('.todo_item').style.display = 'none';
  }

  btnDeleteOption.forEach(btn => btn.addEventListener('click', deletePlan));
} 


////////////////////////////////////////////////////////////////
// Edit 
function mainEdit() {
  const btnEditOption = document.querySelectorAll('.option_edit');

  function editPlan(e) {
    e.target.closest('.todo_item_head').children[0].disabled = !e.target.closest('.todo_item_head').children[0].disabled;
    e.target.closest('.todo_item').children[1].children[0].readOnly =  !e.target.closest('.todo_item').children[1].children[0].readOnly;
    e.target.closest('.todo_item').children[1].children[1].readOnly =  !e.target.closest('.todo_item').children[1].children[1].readOnly;
    e.target.closest('.todo_item').children[1].children[0].focus();
  }

 btnEditOption.forEach(btn => btn.addEventListener('click', editPlan));
}


////////////////////////////////////////////////////////////////
// Drag&Drop
let draggedItem;

function dragUpdate() {  
  let lists = document.querySelectorAll('.drag');
  for(let i = 0; i < todoPlan.length; i++) {
    const item = todoPlan[i];
  
    item.addEventListener('dragstart', function() {
      draggedItem = this;
      setTimeout(function() {
        item.style.display = 'none';
      }, 0)
    });
  
    item.addEventListener('dragend', function() {
      setTimeout(function() {
        draggedItem.style.display = 'flex';
        draggedItem = null;
      }, 0)
    });
  
    for(let j =0; j < lists.length; j ++) {
      const list = lists[j];
  
      list.addEventListener('dragover', function (e) {
        e.preventDefault();
      });
  
      list.addEventListener('dragenter', function (e) {
        e.preventDefault();
      });
  
      list.addEventListener('drop', function(e) {
        this.append(draggedItem);
      });
    }
  }
}
