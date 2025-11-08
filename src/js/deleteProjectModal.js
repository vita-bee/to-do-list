import { PubSub } from './pubsub.js';

export const deleteProjectModal = (function() {
  let modal, span, overlay;
    
  function init() {
    modal = document.getElementById("deleteProjectModal");
    span = document.getElementsByClassName("closeBtn")[3]; //this is 4th modal in the html so use index [3]
    overlay = document.getElementById("deleteProjectOverlay");
    if (!overlay || !modal) {
      console.error("Delete Task Modal elements not found in DOM");
      return;
    }
    PubSub.subscribe("project.deleteRequested", (projectName) => {
      displayProjectDetails(projectName);
      openDeleteProjectModal();
      handleConfirmDeleteModal(projectName);
      setupCloseHandlers();
    });
  }

  function displayProjectDetails(projectName){
    const deleteProjectItemContainer = document.getElementById("deleteProjectItemContainer");
    const projectNameP = document.createElement('p');
    projectNameP.textContent = projectName;
    deleteProjectItemContainer.appendChild(projectNameP);
  }

  function openDeleteProjectModal() {
    overlay.style.display = "block";
  }

  function closeDeleteProjectModal() {
    // retrieving all elements locally to avoid mismatches 
    // this should be done in case  elements and there internals may get 
    // removed or recreated in the dom since globals might point to old versions
    const overlay = document.getElementById("deleteProjectOverlay");
    const deleteProjectConfirmBtn = document.getElementById("deleteProjectConfirmBtn");
    const deleteProjectCancelBtn = document.getElementById("deleteProjectCancelBtn");
    const deleteProjectItemContainer = document.getElementById("deleteProjectItemContainer");
    // Remove the task details / deleteTaskItemContainer from the modal
    while (deleteProjectItemContainer.firstChild) {
      deleteProjectItemContainer.removeChild(deleteProjectItemContainer.firstChild);
    }
    // Remove old listeners if they exist
    if (deleteProjectConfirmBtn._clickListener) {
      deleteProjectConfirmBtn.removeEventListener("click", deleteProjectConfirmBtn._clickListener);
      delete deleteProjectConfirmBtn._clickListener;
    }
    if (deleteProjectCancelBtn._clickListener) {
      deleteProjectCancelBtn.removeEventListener("click", deleteProjectCancelBtn._clickListener);
      delete deleteProjectCancelBtn._clickListener;
    }
    overlay.style.display = "none";
  }

  function setupCloseHandlers() {
    span.onclick = closeDeleteProjectModal;
    overlay.onclick = function(event) {
      if (event.target === overlay) {
        closeDeleteProjectModal();
      }
    };
  }

  function handleConfirmDeleteModal(projectName) {
    const deleteProjectConfirmBtn = document.getElementById("deleteProjectConfirmBtn");
    const deleteProjectCancelBtn = document.getElementById("deleteProjectCancelBtn");
    // Remove old listeners if they exist
    if (deleteProjectConfirmBtn._clickListener) {
      deleteProjectConfirmBtn.removeEventListener("click", deleteProjectConfirmBtn._clickListener);
    }
    if (deleteProjectCancelBtn._clickListener) {
      deleteProjectCancelBtn.removeEventListener("click", deleteProjectCancelBtn._clickListener);
    }
    // Define new listeners
    const confirmListener = () => {
      closeDeleteProjectModal();
      PubSub.publish("project.deleteConfirmed", projectName);
    };
    const cancelListener = () => {
      closeDeleteProjectModal();
    };
    // Store references on the button elments as properties
    deleteProjectConfirmBtn._clickListener = confirmListener;
    deleteProjectCancelBtn._clickListener = cancelListener;
    // Attach listeners
    deleteProjectConfirmBtn.addEventListener("click", confirmListener);
    deleteProjectCancelBtn.addEventListener("click", cancelListener);
  }


  return {init}

})()