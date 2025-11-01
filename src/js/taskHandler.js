import { PubSub } from './pubsub.js';

export const taskHandler = (function() {
  const taskArr = []; 

  function init() {
    console.log('task handler INIT');
    PubSub.subscribe('form.submitted', addNewTask);
    PubSub.subscribe('taskItemContainer.clicked', editTask);
  }
  
  function task(id, title, dueDate, priority, project, descrip, is_done) {    
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.project = project;
    this.descrip = descrip;
    this.is_done = is_done;
    this.markDone = function() { this.is_done = true }
  }
  
  function addNewTask({formData}) {
    console.log('reached add new task function');
    const id = crypto.randomUUID(); 
    const title = formData.get('task_title');
    const dueDate = formData.get('due_date');
    const priority = formData.get('task_priority_select');
    const project = formData.get('task_project_select');
    const descrip = formData.get('task_descrip');
    const is_done = false;
    const newTask = new task(id, title, dueDate, priority, project, descrip, is_done);
    taskArr.push(newTask);
    console.log("newly created task:", taskArr[taskArr.length-1]);
  }

  function markTaskDone({taskId}){
    let taskIndex = taskArr.findIndex(task => task.id === taskId);
    taskArr[taskIndex].markDone;
    console.log("task marked done is:", taskArr[taskIndex]);
  }

  function editTask({taskId}){
    let taskIndex = taskArr.findIndex(task => task.id === taskId);
    console.log("task to edit:", taskArr[taskIndex]);
  }

  function deleteTask({taskId}){
    let taskIndex = taskArr.findIndex(task => task.id === taskId);
    console.log("index to remove:", taskIndex);
    if (taskIndex !== -1) {
        taskArr.splice(taskIndex, 1); 
    }
  }
  
  return {init, addNewTask, deleteTask, editTask, markTaskDone};
})();