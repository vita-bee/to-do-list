import { PubSub } from './pubsub.js';
import { projectData } from './projectData.js';

export const projectSelector = (function() {
  
  function init() {
    // subscribe project updated event when new project is added
    // rebuild menu and select that last newly added project
    PubSub.subscribe('projects.updated', ({projectArr, projectSelectMenuName}) => {
      buildProjectSelector({projectArr, projectSelectMenuName});
      selectLastProject(projectSelectMenuName, projectArr);
    });
    //subscribe to editTaskModalForm load in order to populate it's selector menu
    PubSub.subscribe('editTaskModalForm.loaded', populateEditTaskSelectMenu);
    // populate on first load
    const projectSelectMenuName = "task_project_select";
    const projectArr = projectData.getAll();
    buildProjectSelector({projectArr, projectSelectMenuName});
  }

  function populateEditTaskSelectMenu (editTaskSelectMenuName){
    const projectArr = projectData.getAll();
    buildProjectSelector({projectArr, projectSelectMenuName: editTaskSelectMenuName})
  }

  function buildProjectSelector({projectArr, projectSelectMenuName}) {
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
    // add the "Add new project" option at the end but only if it is the main form selector menu
    // there should be no add new project option in the editTaskModalForm
    if (projectSelectMenuName === 'task_project_select') {
      const addNew = document.createElement('option');
      addNew.value = 'addNew';
      addNew.textContent = '➕Add new project';
      select.appendChild(addNew);
    }
  }

  function selectLastProject(projectSelectMenuName, projectArr) {
    const select = document.getElementById(projectSelectMenuName);
    const lastProject = projectArr[projectArr.length - 1];
    if (lastProject) {
      select.value = lastProject;
    }
  }

  return { init };
})();
