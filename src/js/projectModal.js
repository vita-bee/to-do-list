import { PubSub } from './pubsub.js';

export const projectModal = (function() {
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
    span.onclick = closeAddProjectModal;
    overlay.onclick = function(event) {
      if (event.target === overlay) {
        closeAddProjectModal();
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
    // Store the reference on the form dom element as a property
    addProjectForm._submitListener = listener;
    // Attach the listener
    addProjectForm.addEventListener("submit", listener);
  }

  return {init, open: openAddProjectModal, close: closeAddProjectModal };
  
})();