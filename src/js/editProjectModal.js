import { PubSub } from "./pubsub";

export const editProjectModal = (function () {
  let modal, span, overlay;

  function init() {
    modal = document.getElementById("editProjectModal");
    span = document.getElementsByClassName("closeBtn")[3]; //this is 4th modal in the html so use index [3]
    overlay = document.getElementById("editProjectOverlay");
    if (!overlay || !modal) {
      console.error("Modal elements not found in DOM");
      return;
    }
    PubSub.subscribe("projectItem.editRequested", (origProjectName) => {
      openEditProjectModal(origProjectName);
      handleModalForm(origProjectName);
      handleDeleteBtn(origProjectName);
    });
    setupCloseHandlers();
  }

  function openEditProjectModal({ origProjectName }) {
    document.getElementById("editedProject_name").placeholder = origProjectName;
    overlay.style.display = "block";
  }

  function closeEditProjectModal() {
    const input = document.getElementById("editedProject_name");
    //clear out the project to be deleted info that was displayed
    input.placholder = "";
    input.value = "";
    overlay.style.display = "none";
  }

  function setupCloseHandlers() {
    span.onclick = function () {
      closeEditProjectModal();
    };
    overlay.onclick = function (event) {
      if (event.target === overlay) {
        closeEditProjectModal();
      }
    };
  }

  function handleModalForm({ origProjectName }) {
    const editProjectForm = document.getElementById("editProjectForm");
    // Remove previous listener if it exists
    if (editProjectForm._submitListener) {
      editProjectForm.removeEventListener(
        "submit",
        editProjectForm._submitListener
      );
    }
    // Define the listener
    const listener = function (event) {
      event.preventDefault();
      const editedProjectName = document
        .getElementById("editedProject_name")
        .value.trim();
      if (!editedProjectName) return;
      PubSub.publish("project.editRequested", {
        origProjectName,
        editedProjectName,
      });
      event.target.reset();
      closeEditProjectModal();
    };
    // Store the listener reference on the form dom element as a property so it can be removed later
    editProjectForm._submitListener = listener;
    // Attach the listener
    editProjectForm.addEventListener("submit", listener);
  }

  function handleDeleteBtn({ origProjectName }) {
    const editProjectModal = document.getElementById("editProjectModal");
    const deleteProjectBtn =
      editProjectModal.querySelector(".deleteProjectBtn");
    // Remove previous listener if it exists
    if (deleteProjectBtn._deleteListener) {
      deleteProjectBtn.removeEventListener(
        "click",
        deleteProjectBtn._deleteListener
      );
    }
    // Define new listener
    const listener = () => {
      closeEditProjectModal();
      PubSub.publish("project.deleteRequested", origProjectName);
    };
    // Store the reference on the button dome element as a property
    deleteProjectBtn._deleteListener = listener;
    // Add the listener
    deleteProjectBtn.addEventListener("click", listener);
  }

  return { init };
})();
