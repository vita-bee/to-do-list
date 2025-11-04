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
    const form = document.getElementById("addProjectForm");
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      const projectName = document.getElementById("project_name").value.trim();
      if (!projectName) return;
      
      console.log("Modal Form submitted. Project Name:", projectName);
      const projectSelectorName = "task_project_select" 
      //passing in the dom element project selector name to differentiate 
      // since it exists in main form as well as editTaskModalForm
      PubSub.publish("project.newsubmitted", {projectName, projectSelectorName});
      form.reset();
      closeAddProjectModal();
    });
  }


return {init, open: openAddProjectModal, close: closeAddProjectModal };

})();