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
      populateEditTaskModalForm(origTask);
      openEditTaskModal();
      handleEditTaskModalForm(origTask);
      setupCloseHandlers();
    });
    
  }

  function populateEditTaskModalForm(task){
    const editTaskform = document.getElementById("editTaskForm");
    console.log("task to populate is", task);
    editTaskform.querySelector('#editTask_name').value = task.title || '';
    editTaskform.querySelector('#editTask_due_date').value = task.dueDate || '';
    editTaskform.querySelector('#editTask_project_select').value = task.project || 'inbox';
    editTaskform.querySelector('#editTask_priority_select').value = task.priority || 'Normal';
    editTaskform.querySelector('#editTask_descrip').value = task.descrip || '';
    editTaskform.querySelector('#editTask_is_done').checked = !!task.is_done; // ensures boolean
  }

  function openEditTaskModal() {
    overlay.style.display = "block";

  }

  function closeEditTaskModal() {
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
    console.log("handle edit task modal form: orig task:", origTask)
    const editTaskform = document.getElementById("editTaskForm");
    editTaskform.addEventListener("submit", function(event) {
      event.preventDefault();
      const formData = new FormData(event.target)
      const id = origTask.id; 
      const title = formData.get('editTask_name');
      const dueDate = formData.get('editTask_due_date');
      const priority = formData.get('editTask_priority_select');
      const project = formData.get('editTask_project_select');
      const descrip = formData.get('editTask_descrip');
      const is_done = formData.get('editTask_is_done');
      const editedTask = {
        id: id,
        title: title,
        dueDate: dueDate,
        priority: priority,
        project: project,
        descrip: descrip,
        is_done: is_done,
      }
      console.log("Edit Modal Form submitted. Edited task:", editedTask);
      PubSub.publish("taskItem.editSubmitted", editedTask); 
      editTaskform.reset();
      closeEditTaskModal();
    }, { once: true }); //event listener should run only once each time
    
  }


return {init, open: openEditTaskModal, close: closeEditTaskModal };

})();