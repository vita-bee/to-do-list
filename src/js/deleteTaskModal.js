import { PubSub } from './pubsub.js';

export const deleteTaskModal = (function() {
  let modal, span, overlay;
  

  function init() {
    modal = document.getElementById("deleteTaskModal");
    span = document.getElementsByClassName("closeBtn")[2]; //this is 3rd modal in the html so use index [2]
    overlay = document.getElementById("deleteTaskOverlay");
    if (!overlay || !modal) {
      console.error("Delete Task Modal elements not found in DOM");
      return;
    }
    PubSub.subscribe("taskItem.deleteRequested", (task) => {
      displayTaskDetails(task);
      openDeleteTaskModal();
      handleConfirmDeleteTask(task);
      setupCloseHandlers();
    });
  }

  function displayTaskDetails(task){
    const deleteTaskItemContainer = document.getElementById("deleteTaskItemContainer");
      if (task.priority === "High") {
        deleteTaskItemContainer.classList.add('priorityHigh')
      } else if (task.priority === "Low"){
        deleteTaskItemContainer.classList.add('priorityLow')
      } 
      const taskTitleP = document.createElement('p');
      taskTitleP.classList.add('taskTitle');
      taskTitleP.textContent = task.title;
      deleteTaskItemContainer.appendChild(taskTitleP);

      const taskProjectNameP = document.createElement('p');
      taskProjectNameP.classList.add('taskProjectName');
      taskProjectNameP.textContent = task.project;
      deleteTaskItemContainer.appendChild(taskProjectNameP);

      const taskDescripP = document.createElement('p');
      taskDescripP.classList.add('taskDescrip');
      taskDescripP.textContent = task.descrip;

      if (task.is_done) {
        deleteTaskItemContainer.classList.add("doneTask");
      } else {
        deleteTaskItemContainer.classList.remove("doneTask");
      }

      deleteTaskItemContainer.appendChild(taskDescripP);
  }

  function openDeleteTaskModal() {
    overlay.style.display = "block";
  }

  function closeDeleteTaskModal() {
    overlay.style.display = "none";
  }

  function setupCloseHandlers() {
    span.onclick = closeDeleteTaskModal;
    overlay.onclick = function(event) {
      if (event.target === overlay) {
        closeDeleteTaskModal();
      }
    };
  }

  function handleConfirmDeleteTask(task) {
    //console.log("handle delete task: task:", task);
    const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
    const handleDeleteClick = () => {
      closeDeleteTaskModal();
      PubSub.publish("taskItem.deleteConfirmed", task.id);
    };
    // Remove any previous listener before adding a new one
    deleteConfirmBtn.removeEventListener("click", handleDeleteClick);
    deleteConfirmBtn.addEventListener("click", handleDeleteClick);
    // console.log("Delete Modal Confirm submitted. Delete task:", task);
  }

  return {init, open: openDeleteTaskModal, close: closeDeleteTaskModal}
})()