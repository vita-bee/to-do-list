import { PubSub } from './pubsub.js';

export const addProjectModal = (function() {
  let modal, span, overlay;
  

  function init() {
    modal = document.getElementById("addProjectModal");
    span = document.getElementsByClassName("closeBtn")[0];
    overlay = document.getElementById("addProjectOverlay");
    if (!overlay || !modal) {
      console.error("Modal elements not found in DOM");
      return;
    }
    PubSub.subscribe('project.addNewSelected', openAddProjectModal);
    handleModalForm();
    setupCloseHandlers();
  }

  function openAddProjectModal() {
    overlay.style.display = "block";
  }

  function closeAddProjectModal() {
    // retrieving all elements locally to avoid mismatches 
    // this should be done in case  elements and there internals may get 
    // removed or recreated in the dom since globals might point to old versions
    const addProjectForm = document.getElementById("addProjectForm");
    // remove event listener on close
    if (addProjectForm._submitListener) {
      addProjectForm.removeEventListener("submit", addProjectForm._submitListener);
      delete addProjectForm._submitListener;
    }
    overlay.style.display = "none";
  }

  function setupCloseHandlers() {
    // if add proj modal closed without new project added, 
    // that is, closed via X or clicking outside the modal
    // then publish this event so the project selector menu can be rebuilt
    span.onclick = function() {
      closeAddProjectModal();
      PubSub.publish("projectModal.closedWithoutSubmit", {});
    }
    overlay.onclick = function(event) {
      if (event.target === overlay) {
        closeAddProjectModal();
        PubSub.publish("projectModal.closedWithoutSubmit", {});
      }
    };
  }

  function handleModalForm() {
    const addProjectForm = document.getElementById("addProjectForm");
    // Remove previous listener if it exists
    if (addProjectForm._submitListener) {
      addProjectForm.removeEventListener("submit", addProjectForm._submitListener);
    }
    // Define the listener
    const listener = function(event) {
      event.preventDefault();
      const projectName = document.getElementById("project_name").value.trim();
      if (!projectName) return;
      const projectSelectMenuName = "task_project_select";
      PubSub.publish("project.newsubmitted", { projectName, projectSelectMenuName });
      event.target.reset();
      closeAddProjectModal();
    };
    // Store the listener reference on the form dom element as a property so it can be removed later
    addProjectForm._submitListener = listener;
    // Attach the listener
    addProjectForm.addEventListener("submit", listener);
  }

  return {init, open: openAddProjectModal, close: closeAddProjectModal };
  
})();