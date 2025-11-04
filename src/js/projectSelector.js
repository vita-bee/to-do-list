import { PubSub } from './pubsub.js';
import { projectData } from './projectData.js';

export const projectSelector = (function() {
  
  function init() {
    // subscribe to updates
    PubSub.subscribe('projects.updated', updateProjectSelector);
    //subscribe to editTaskModalForm load in order to populate it's selector menu
    PubSub.subscribe('editTaskModalForm.loaded', populateEditTaskSelectMenu);
    // populate on first load
    const projectSelectMenuName = "task_project_select";
    const projectArr = projectData.getAll();
    updateProjectSelector({projectArr, projectSelectMenuName});
  }

  function populateEditTaskSelectMenu (editTaskSelectMenuName){
    console.log("selectorName passed to populate edit modal:", editTaskSelectMenuName);
    const projectArr = projectData.getAll();
    updateProjectSelector({projectArr, projectSelectMenuName: editTaskSelectMenuName})
  }

  function updateProjectSelector({projectArr, projectSelectMenuName}) {
    console.log("projectSelectMenuName:", projectSelectMenuName);
    const select = document.getElementById(projectSelectMenuName);
    // clear existing options
    select.innerHTML = '';

    // build new ones
    projectArr.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });

    // add the "Add new project" option at the end
    // but only if it is the main form selector menu
    // there should be no add new project option in the editTaskModalForm
    if (projectSelectMenuName === 'task_project_select') {
      const addNew = document.createElement('option');
      addNew.value = 'addNew';
      addNew.textContent = '➕Add new project';
      select.appendChild(addNew);
    }
    const lastProject = projectArr[projectArr.length - 1];
    if (lastProject) {
      select.value = lastProject;
    }
  }

  return { init };
})();
