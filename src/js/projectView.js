import "../styles.css";
import { PubSub } from './pubsub.js';
import { projectData } from "./projectData.js";
import { taskData } from "./taskData.js";
import { navHandler } from "./navHandler.js";

export const renderProjectView = (function() {

  function init(projectArr, taskArr) {
    PubSub.subscribe('tasks.updated', handleTasksUpdated);
    PubSub.subscribe('projects.updated', handleProjectsUpdated);
    renderProjects(projectArr, taskArr);
  }

  function handleTasksUpdated(taskArr) {
      // only re-render updates if the project view is active
      if (navHandler.getActiveTab() === 'projectView') {
        const projectArr = projectData.getAllProjectsSorted();
        renderProjects(projectArr, taskArr);
      }
    }

    function handleProjectsUpdated({projectArr, projectSelectMenuName}) {
      // only re-render updates if the project view is active
      if (navHandler.getActiveTab() === 'projectView') {
        const taskArr = taskData.getAllTasksSorted();
        renderProjects(projectArr, taskArr);
      }
    }

  function renderProjects(projArr, taskArr) {
    const viewContainer = document.getElementById("viewContainer");
    // Clear current view
    while (viewContainer.firstChild) {
        viewContainer.removeChild(viewContainer.firstChild);
    }
    
    const projectCardsContainer = document.createElement("div");
    projectCardsContainer.id = 'projectCardsContainer';
    
    projArr.forEach(projectName => {
      const card = document.createElement("div");
      card.classList.add('card');
      const projectItemContainer = document.createElement("div");
      projectItemContainer.classList.add('projectItemContainer');
      projectItemContainer.id = projectName;
      const h4 = document.createElement("h4");
      h4.textContent = projectName;
      const hr = document.createElement("hr");
      projectItemContainer.appendChild(h4);
      card.appendChild(projectItemContainer);
      card.appendChild(hr);

      taskArr.forEach(task => {
        if (task.project === projectName){
          const taskItemContainer = document.createElement('div');
          taskItemContainer.classList.add('taskItemContainer');
          taskItemContainer.id = task.id;
          if (task.priority === "High") {
            taskItemContainer.classList.add('priorityHigh')
          } else if (task.priority === "Low"){
            taskItemContainer.classList.add('priorityLow')
          } 
          const taskTitleP = document.createElement('p');
          taskTitleP.classList.add('taskTitle');
          taskTitleP.textContent = task.title;
          taskItemContainer.appendChild(taskTitleP);

          const taskDueDateP = document.createElement('p');
          taskDueDateP.classList.add('taskDueDate');
          taskDueDateP.textContent = task.dueDate;
          taskItemContainer.appendChild(taskDueDateP);

          const taskDescripP = document.createElement('p');
          taskDescripP.classList.add('taskDescrip');
          taskDescripP.textContent = task.descrip;

          if (task.is_done) {
            taskItemContainer.classList.add("doneTask");
          } else {
            taskItemContainer.classList.remove("doneTask");
          }

          taskItemContainer.appendChild(taskDescripP);
          card.appendChild(taskItemContainer);
        }
      });
      projectCardsContainer.appendChild(card);
    });

    viewContainer.appendChild(projectCardsContainer);
  }

  return {init};

})();