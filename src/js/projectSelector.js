import { PubSub } from './pubsub.js';
import { projectData } from './projectData.js';

export const projectSelector = (function() {
  const mainProjSelectMenu = document.getElementById('task_project_select');

  function init() {
    // subscribe project updated event when new project is added
    // rebuild menu and select that last newly added project
    PubSub.subscribe('projects.updated', ({projectArr, projectSelectMenuName}) => {
      buildProjectSelector({projectArr, projectSelectMenuName});
      resetSelectValue();
      //selectLastProject(projectSelectMenuName, projectArr);
    });
    // when a new project is added, set selector menu to it
    PubSub.subscribe('project.added', selectJustAddedProject);
    //subscribe to editTaskModalForm load in order to populate it's selector menu
    PubSub.subscribe('editTaskModalForm.loaded', populateEditTaskSelectMenu);
    // subscribe on projectModal closed without new project submit, if so, 
    // need to reset select value of the project select menu to first opion in list.
    PubSub.subscribe("projectModal.closedWithoutSubmit", resetSelectValue);

    // populate on first load
    const projectSelectMenuName = "task_project_select";
    const projectArr = projectData.getAllProjectsSorted();
    buildProjectSelector({projectArr, projectSelectMenuName});    
  }

  function populateEditTaskSelectMenu (editTaskSelectMenuName){
    const projectArr = projectData.getAllProjectsSorted();
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

  function selectJustAddedProject(projectName){
    //when a new project is just added, make it the selected option 
    mainProjSelectMenu.value = projectName;
  }

  function resetSelectValue(){
    mainProjSelectMenu.selectedIndex = 0;
  }

  return { init };
})();
