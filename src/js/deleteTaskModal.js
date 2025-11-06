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
      handleConfirmDeleteModal(task);
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
    // retrieving all elements locally to avoid mismatches 
    // this should be done in case  elements and there internals may get 
    // removed or recreated in the dom since globals might point to old versions
    const overlay = document.getElementById("deleteTaskOverlay");
    const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
    const deleteCancelBtn = document.getElementById("deleteCancelBtn");
    const deleteTaskItemContainer = document.getElementById("deleteTaskItemContainer");
    // Remove the task details / deleteTaskItemContainer from the modal
    while (deleteTaskItemContainer.firstChild) {
      deleteTaskItemContainer.removeChild(deleteTaskItemContainer.firstChild);
    }
    // Remove old listeners if they exist
    if (deleteConfirmBtn._clickListener) {
      deleteConfirmBtn.removeEventListener("click", deleteConfirmBtn._clickListener);
      delete deleteConfirmBtn._clickListener;
    }
    if (deleteCancelBtn._clickListener) {
      deleteCancelBtn.removeEventListener("click", deleteCancelBtn._clickListener);
      delete deleteCancelBtn._clickListener;
    }
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

  function handleConfirmDeleteModal(task) {
    const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
    const deleteCancelBtn = document.getElementById("deleteCancelBtn");
    // Remove old listeners if they exist
    if (deleteConfirmBtn._clickListener) {
      deleteConfirmBtn.removeEventListener("click", deleteConfirmBtn._clickListener);
    }
    if (deleteCancelBtn._clickListener) {
      deleteCancelBtn.removeEventListener("click", deleteCancelBtn._clickListener);
    }
    // Define new listeners
    const confirmListener = () => {
      closeDeleteTaskModal();
      PubSub.publish("taskItem.deleteConfirmed", task.id);
    };
    const cancelListener = () => {
      closeDeleteTaskModal();
    };
    // Store references on the button elments as properties
    deleteConfirmBtn._clickListener = confirmListener;
    deleteCancelBtn._clickListener = cancelListener;
    // Attach listeners
    deleteConfirmBtn.addEventListener("click", confirmListener);
    deleteCancelBtn.addEventListener("click", cancelListener);
  }


  return {init, open: openDeleteTaskModal, close: closeDeleteTaskModal}
})()