// src/index.js
import "./styles.css";
// import { format, addDays } from 'date-fns';
import { PubSub } from './js/pubsub.js';
import { localStorageHandler } from './js/localStorage.js';
import { taskData } from './js/taskData.js'
import { renderMonthView } from "./js/monthView.js";
import { addProjectModal } from "./js/addProjectModal.js"
import { projectData } from "./js/projectData.js";
import { projectSelector } from "./js/projectSelector.js";
import { editTaskModal } from "./js/editTaskModal.js";
import { deleteTaskModal } from "./js/deleteTaskModal.js";
import { editProjectModal } from "./js/editProjectModal.js";
import { navHandler } from "./js/navHandler.js";
import { deleteProjectModal } from "./js/deleteProjectModal.js";


document.addEventListener("click", handleEvent);
document.addEventListener("submit", handleEvent);
document.addEventListener("change", handleEvent);

function handleEvent(event) {
  
  if (event.type === "click") {
    const taskItem = event.target.closest(".taskItemContainer");
    const projectItem = event.target.closest(".projectItemContainer");
    const backArrow = event.target.matches("#backArrow");
    const forwardArrow = event.target.matches("#forwardArrow");
    if (taskItem) {
      PubSub.publish("taskItem.editRequested", taskItem.id);
    }
    if (projectItem) {
      console.log("project item clicked:", projectItem.id)
      PubSub.publish("projectItem.editRequested", {origProjectName: projectItem.id});
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
  navHandler.init();
  renderMonthView.init(taskData.getAllTasksSorted()); //on load render the monthview
  addProjectModal.init();
  editTaskModal.init();
  deleteTaskModal.init();
  editProjectModal.init();
  deleteProjectModal.init();
});


