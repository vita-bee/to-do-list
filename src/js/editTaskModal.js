import { PubSub } from './pubsub.js';

export const editTaskModal = (function() {
  let modal, span, overlay; 
  
  function init() {
    modal = document.getElementById("editTaskModal");
    span = document.getElementsByClassName("closeBtn")[1]; //this is 2nd modal in the html so use index [1]
    overlay = document.getElementById("editTaskOverlay");
    if (!overlay || !modal) {
      console.error("Modal elements not found in DOM");
      return;
    }
    PubSub.subscribe("editTaskItem.dataLoaded", (origTask) => {
      populateProjectSelectMenu();
      populateEditTaskModalForm(origTask);
      openEditTaskModal();
      handleEditTaskModalForm(origTask);
      handleDeleteBtn(origTask);
      setupCloseHandlers();
    });
  }

  function populateProjectSelectMenu() {
    // publish msg that edit taskmodal is loaded so projectSelector module can 
    // react and populate the proj selector menu in the editTaskModalForm
    // pass in the dom element name for the selector
    const editTaskSelectMenuName = 'editTask_project_select';
    PubSub.publish('editTaskModalForm.loaded', editTaskSelectMenuName);
  }

  function populateEditTaskModalForm(task){
    const editTaskform = document.getElementById("editTaskForm");
    // console.log("task to populate is", task);
    editTaskform.querySelector('#editTask_name').value = task.title;
    editTaskform.querySelector('#editTask_due_date').value = task.dueDate;
    editTaskform.querySelector('#editTask_project_select').value = task.project;
    editTaskform.querySelector('#editTask_priority_select').value = task.priority;
    editTaskform.querySelector('#editTask_descrip').value = task.descrip;
    editTaskform.querySelector('#editTask_is_done').checked = !!task.is_done; // ensures boolean
  }

  function openEditTaskModal() {
    overlay.style.display = "block";
  }

  function closeEditTaskModal() {
    // retrieving all elements locally to avoid mismatches 
    // this should be done in case  elements and there internals may get 
    // removed or recreated in the dom since globals might point to old versions
    const editTaskform = document.getElementById("editTaskForm");
    const editTaskModal = document.getElementById("editTaskModal");
    const deleteTaskBtn = editTaskModal.querySelector(".deleteTaskBtn"); 
    // Remove old listeners if they exists
    if (deleteTaskBtn._deleteListener) {
      deleteTaskBtn.removeEventListener("click", deleteTaskBtn._deleteListener);
      delete deleteTaskBtn._deleteListener;
    }
    if (editTaskform._editListener) {
      editTaskform.removeEventListener("submit", editTaskform._editListener);
      delete editTaskform._editListener; // optional, clean up
    }
      overlay.style.display = "none";
  }

  function setupCloseHandlers() {
    span.onclick = closeEditTaskModal;
    overlay.onclick = function(event) {
      if (event.target === overlay) {
        closeEditTaskModal();
      }
    };
  }

  function handleEditTaskModalForm(origTask) {
    const editTaskform = document.getElementById("editTaskForm");
    // console.log("handle edit task modal form: orig task:", origTask);
    // If a previous listener exists, remove it
    if (editTaskform._editListener) {
      editTaskform.removeEventListener("submit", editTaskform._editListener);
    }
    // Create a new listener that closes over origTask
    const listener = function(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const id = origTask.id;
      const title = formData.get('editTask_name');
      const dueDate = formData.get('editTask_due_date');
      const priority = formData.get('editTask_priority_select');
      const project = formData.get('editTask_project_select');
      const descrip = formData.get('editTask_descrip');
      const is_done = !!formData.get('editTask_is_done'); // convert checkbox result to boolean
      const editedTask = {
        id,
        title,
        dueDate,
        priority,
        project,
        descrip,
        is_done,
      };
      // console.log("Edit Modal Form submitted. Edited task:", editedTask);
      PubSub.publish("taskItem.editSubmitted", editedTask);
      editTaskform.reset();
      closeEditTaskModal();
    };
    // Store this listener reference so can be remove next time function is called.
    // because extra listeners hanging around is creating bugs in code
    editTaskform._editListener = listener;
    // Attach it
    editTaskform.addEventListener("submit", listener);
 }


function handleDeleteBtn(task) {
  const editTaskModal = document.getElementById("editTaskModal");
  const deleteTaskBtn = editTaskModal.querySelector(".deleteTaskBtn"); 
  // Remove previous listener if it exists
  if (deleteTaskBtn._deleteListener) {
    deleteTaskBtn.removeEventListener("click", deleteTaskBtn._deleteListener);
  }
  // Define new listener
  const listener = () => {
    closeEditTaskModal();
    PubSub.publish("taskItem.deleteRequested", task);
  };
  // Store the reference on the button dome element as a property
  deleteTaskBtn._deleteListener = listener;
  // Add the listener
  deleteTaskBtn.addEventListener("click", listener);
}


return {init};

})();