// src/index.js
import "./styles.css";
import { format, addDays } from 'date-fns';
import { PubSub } from './js/pubsub.js';
import { taskFormHandler } from './js/taskFormHandler.js'
import { renderMonthView } from "./js/monthView.js";
import { projectModalHandler } from "./js/projectModalHandler.js"
import { projectData } from "./js/projectData.js";
import { projectSelectorHandler } from "./js/projectSelectorHandler.js";

console.log("hello");
const today = new Date();
const tomorrow = addDays(today, 1);
console.log('Today:', format(today, 'yyyy-MM-dd'));
console.log('Tomorrow:', format(tomorrow, 'yyyy-MM-dd'));

document.addEventListener("click", handleEvent);
document.addEventListener("submit", handleEvent);
document.addEventListener("change", handleEvent);

function handleEvent(event) {
  
  if (event.type === "click") {
    console.log("click occurred");
    const taskItem = event.target.closest(".taskItemContainer");
    if (taskItem) {
      console.log("task item container was clicked");
      PubSub.publish("taskItemContainer.clicked", { id: taskItem.id });
    }
  }
  if (event.type === "submit" && event.target.matches("#addTaskForm")) {
    console.log('form submit occurred:', event.type);
    event.preventDefault();
    PubSub.publish('form.submitted', {formData: new FormData(event.target)});
    const form = document.getElementById('addTaskForm');
    form.reset();
  }
  if (event.type === "change" && event.target.matches("#task_project_select")) {
    if (event.target.value === "addNew") {
      console.log("add new project chosen:", event.type);
      PubSub.publish("project.addNewSelected", {});
    }
  }
}


document.addEventListener("DOMContentLoaded", () => {
  taskFormHandler.init();
  renderMonthView.init();
  projectModalHandler.init();
  projectData.init(['Default Inbox']);
  projectSelectorHandler.init();
});