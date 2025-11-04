import { PubSub } from './pubsub.js';

export const taskData = (function() {
  let taskArr = []; 
  
  function init() {
    console.log('task handler INIT');
    PubSub.subscribe('addTaskform.submitted', addNewTask);
    PubSub.subscribe('monthView.changed', publishTasksUpdated);
    PubSub.subscribe("taskItem.editRequested", loadTaskToEditData);
    PubSub.subscribe("taskItem.editSubmitted", editTask); 
  }

  function loadFromStorage(storedTasks){
    taskArr = storedTasks;
  }
    
  // when task item is clicked, the specific tasks data needs to be made available
  // to the edit modal. Data will be loaded via publish event which the modal subscribes to
  function loadTaskToEditData(taskId) {
    const task = getTaskById(taskId);
    PubSub.publish('editTaskItem.dataLoaded', task );
  }

  function getTaskById(id) {
    const task = taskArr.find(task => task.id === id);
    if (!task) {
      console.warn('Task not found:', id);
    } else {
      console.log('Found task:', task);
      return task;
    }
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

  // when month is changed, publish update tasks so they get re-rendered by subscriber in monthView.js
  function publishTasksUpdated() {
    PubSub.publish('tasks.updated', [...taskArr]);
  }

  function getAllTasks() {
    return [...taskArr];
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
    PubSub.publish('tasks.updated', [...taskArr]); // publish copy of array
  }

  function editTask(editedTask) {
    console.log("editTask: Task to update task arr with:", editedTask);
    const index = taskArr.findIndex(task => task.id === editedTask.id);
    if (index !== -1) {
      taskArr[index] = editedTask;   
      PubSub.publish('tasks.updated', [...taskArr]); 
    } else {
      console.warn(`Can't edit task. Task with id ${editedTask.id} not found`);
    }
  } 
  
  function markTaskDone(taskId){
    let taskIndex = taskArr.findIndex(task => task.id === taskId);
    taskArr[taskIndex].markDone;
    console.log("task marked done is:", taskArr[taskIndex]);
  }

  function deleteTask(taskId){
    let taskIndex = taskArr.findIndex(task => task.id === taskId);
    console.log("index to remove:", taskIndex);
    if (taskIndex !== -1) {
        taskArr.splice(taskIndex, 1); 
    }
  }

  
  
  return {init, addNewTask, deleteTask, editTask, markTaskDone, getAllTasks, loadFromStorage};
})();