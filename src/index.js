// src/index.js
import "./styles.css";
import { format, addDays } from 'date-fns';
import { PubSub } from './js/pubsub.js';
import { localStorageHandler } from './js/localStorage.js';
import { taskData } from './js/taskData.js'
import { renderMonthView } from "./js/monthView.js";
import { renderProjectView } from "./js/renderProjectView.js";
import { projectModal } from "./js/projectModal.js"
import { projectData } from "./js/projectData.js";
import { projectSelector } from "./js/projectSelector.js";
import { editTaskModal } from "./js/editTaskModal.js";
import { deleteTaskModal } from "./js/deleteTaskModal.js";

const today = new Date();
const tomorrow = addDays(today, 1);
console.log('Today:', format(today, 'yyyy-MM-dd'));
console.log('Tomorrow:', format(tomorrow, 'yyyy-MM-dd'));

document.addEventListener("click", handleEvent);
document.addEventListener("submit", handleEvent);
document.addEventListener("change", handleEvent);

function handleEvent(event) {
  
  if (event.type === "click") {
    const taskItem = event.target.closest(".taskItemContainer");
    const backArrow = event.target.matches("#backArrow");
    const forwardArrow = event.target.matches("#forwardArrow");
    if (taskItem) {
      // console.log("task item container was clicked, task id is:" , taskItem.id);
      PubSub.publish("taskItem.editRequested", taskItem.id);
    }
    if (backArrow){
      PubSub.publish("backArrow.clicked", {});
    }
    if (forwardArrow){
      PubSub.publish("forwardArrow.clicked", {});
    }
  }
  if (event.type === "submit" && event.target.matches("#addTaskForm")) {
    event.preventDefault();
    PubSub.publish('addTaskform.submitted', {formData: new FormData(event.target)});
    const form = document.getElementById('addTaskForm');
    form.reset();
  }
  if (event.type === "change" && event.target.matches("#task_project_select")) {
    if (event.target.value === "addNew") {
      PubSub.publish("project.addNewSelected", {});
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  localStorageHandler.init(); //first load stored tasks and projects to projectArr and taskArr
  taskData.init();
  projectData.init();
  projectSelector.init();
  renderMonthView.init(taskData.getAllTasks());
  projectModal.init();
  editTaskModal.init();
  deleteTaskModal.init();
});


const content = document.getElementById("viewContainer");
const navButtons = document.querySelectorAll('.navBtn');
navButtons.forEach(navBtn => {
  navBtn.addEventListener('click', () => {
    console.log(`Button "${navBtn.textContent}" was clicked!`);
    document.querySelectorAll('.navBtn').forEach(navBtn => navBtn.classList.add('inActiveNavTab'));
    if (navBtn.textContent==="Project View") {
        navBtn.classList.remove('inActiveNavTab');
        navBtn.classList.add('activeNavTab');
        content.replaceChildren();
        renderProjectView.init(projectData.getAllProjects());
    } else if (navBtn.textContent==="Month View") {
        navBtn.classList.remove('inActiveNavTab');
        navBtn.classList.add('activeNavTab');
        content.replaceChildren();
        renderMonthView.init(taskData.getAllTasks());
    } 
  });
});