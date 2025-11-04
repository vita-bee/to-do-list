import { PubSub } from './pubsub.js';
import { projectData } from './projectData.js';

export const projectSelector = (function() {
  
  function init() {
    // subscribe to updates
    PubSub.subscribe('projects.updated', updateProjectSelector);

    // populate on first load
    updateProjectSelector(projectData.getAll());
  }

  function updateProjectSelector({projectArr, projectSelectorName}) {
    console.log("projectSelectorName:", projectSelectorName);
    const select = document.getElementById(projectSelectorName);
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
    const addNew = document.createElement('option');
    addNew.value = 'addNew';
    addNew.textContent = '➕Add new project';
    select.appendChild(addNew);

    const lastProject = projectArr[projectArr.length - 1];
    if (lastProject) {
      select.value = lastProject;
    }
  }

  return { init };
})();
