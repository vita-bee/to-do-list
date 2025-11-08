import { PubSub } from './pubsub.js';
import { projectData } from './projectData.js';

export const projectSelector = (function() {
  const mainProjSelectMenuId = "task_project_select";
  const mainProjSelectMenuElement = document.getElementById(mainProjSelectMenuId);

  function init() {
    // subscribe to project updated event (when new project is added/deleted/edited)
    // rebuild menu and reset to the first option in the selection menu.
    PubSub.subscribe('projects.updated', (projectArr) => {
      buildProjectSelector(projectArr, mainProjSelectMenuId);
      resetSelectValue();
    });
    // when a new project is added, set selector menu option to that newly added project
    PubSub.subscribe('project.added', selectJustAddedProject);
    // when duplicate not added, reset selector menu option else it will stay on "add new" 
    PubSub.subscribe('project.dupNotAdded', resetSelectValue)
    // when projectModal closed by user without new project submitted, 
    // reset selector menu option else it will stay on "add new" 
    PubSub.subscribe("projectModal.closedWithoutSubmit", resetSelectValue);
    //when editTaskModalForm loaded, populate it's selector menu
    PubSub.subscribe('editTaskModalForm.loaded', populateEditTaskSelectMenu);
    
    // populate main form's project select menu on first load
    const projectArr = projectData.getAllProjectsSorted();
    buildProjectSelector(projectArr, mainProjSelectMenuId);    
  }

  function populateEditTaskSelectMenu (editTaskSelectMenuName){
    const projectArr = projectData.getAllProjectsSorted();
    buildProjectSelector(projectArr, editTaskSelectMenuName)
  }

  function buildProjectSelector(projectArr, projectSelectMenuName) {
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
    if (projectSelectMenuName === mainProjSelectMenuId) {
      const addNew = document.createElement('option');
      addNew.value = 'addNew';
      addNew.textContent = '➕Add new project';
      select.appendChild(addNew);
    }
  }

  function selectJustAddedProject(projectName){
    // when a new project is just added, make it the selected option 
    mainProjSelectMenuElement.value = projectName;
  }

  function resetSelectValue(){
    // Set selected value on main form to first option
    mainProjSelectMenuElement.selectedIndex = 0;
  }

  return { init };
})();
