// src/index.js
import "./styles.css";
import { format, addDays } from 'date-fns';
import { PubSub } from './js/pubsub.js';
import { taskHandler } from './js/taskHandler.js'

console.log("hello");
const today = new Date();
const tomorrow = addDays(today, 1);
console.log('Today:', format(today, 'yyyy-MM-dd'));
console.log('Tomorrow:', format(tomorrow, 'yyyy-MM-dd'));

document.addEventListener("click", handleEvent);
document.addEventListener("submit", handleEvent);

function handleEvent(event) {
  
  if (event.type === "click") {
    console.log("click occurred");
    const taskItem = event.target.closest(".taskItemContainer");
    if (taskItem) {
      console.log("task item container was clicked");
      PubSub.publish("taskItemContainer.clicked", { id: taskItem.id });
    }
  }
  if (event.type === "submit" && event.target.matches("form")) {
    console.log('form submit occurred:', event.type);
    event.preventDefault();
    PubSub.publish('form.submitted', {formData: new FormData(event.target)});
  }
}

taskHandler.init();

