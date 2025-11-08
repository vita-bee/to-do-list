import { PubSub } from './pubsub.js';

export const taskData = (function() {
  const taskArr = []; 
  
  function init() {
    PubSub.subscribe('addTaskform.submitted', addNewTask);
    PubSub.subscribe('monthView.changed', publishTasksUpdated);
    PubSub.subscribe("taskItem.editRequested", loadTaskToEditData);
    PubSub.subscribe("taskItem.editSubmitted", editTask); 
    PubSub.subscribe("taskItem.deleteConfirmed", deleteTask);
    PubSub.subscribe('project.edited', editTaskProjectName);
    PubSub.subscribe("project.deleted", deleteAllTasksWithProject);
  }

  function loadFromStorage(storedTasks) {
    if (!Array.isArray(storedTasks)) return;
    taskArr.length = 0; //clear array             
    taskArr.push(...storedTasks); //repopulate with array from local storage
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
      return task;
    }
  }

  function editTaskProjectName({ origProjectName, editedProjectName }){
    taskArr.forEach((task) => {
      if (task.project === origProjectName) {
        task.project = editedProjectName;
      }
    });
    PubSub.publish('tasks.updated', [...taskArr]);
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

  function getAllTasksSorted() {
    // sort task arr by date and return
    taskArr.sort(function compare(a, b) {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB;
    });
    return [...taskArr];
  }

  function addNewTask({formData}) {
    const id = crypto.randomUUID(); 
    const title = formData.get('task_title');
    const dueDate = formData.get('due_date');
    const priority = formData.get('task_priority_select');
    const project = formData.get('task_project_select');
    const descrip = formData.get('task_descrip');
    const is_done = false;
    const newTask = new task(id, title, dueDate, priority, project, descrip, is_done);
    taskArr.push(newTask);
    PubSub.publish('tasks.updated', [...taskArr]); // publish copy of array
  }

  function editTask(editedTask) {
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
    PubSub.publish('tasks.updated', [...taskArr]);
  }

  function deleteTask(taskId){
    let taskIndex = taskArr.findIndex(item => item.id === taskId);
    if (taskIndex !== -1) {
        taskArr.splice(taskIndex, 1); 
    }
    PubSub.publish('tasks.updated', [...taskArr]);
  }

  function deleteAllTasksWithProject(projectName) {
    // must loop in reverse to avoid indice shifting when items get deleted
    for (let i = taskArr.length - 1; i >= 0; i--) {
      if (taskArr[i].project === projectName) {
        taskArr.splice(i, 1);
      }
    }
    PubSub.publish('tasks.updated', [...taskArr]);
  }

  
  return {init, addNewTask, deleteTask, editTask, markTaskDone, getAllTasksSorted, loadFromStorage};
})();