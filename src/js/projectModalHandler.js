import { PubSub } from './pubsub.js';
import { projectData } from './projectData.js';

export const projectModalHandler = (function() {
  let modal, span, overlay;

  function init() {
    console.log('MODAL handler INIT');
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
    console.log('opening modal....');
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
      // PubSub.publish("project.added", { projectName: projectName });
      projectData.addProject(projectName); // projectdata funct adds to array and triggers PubSub event 
      form.reset();
      closeAddProjectModal();
    });
  }


return {init, open: openAddProjectModal, close: closeAddProjectModal };

})();