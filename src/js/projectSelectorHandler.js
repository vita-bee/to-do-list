import { PubSub } from './pubsub.js';
import { projectData } from './projectData.js';

export const projectSelectorHandler = (function() {
  const select = document.getElementById('task_project_select');

  function init() {
    // subscribe to updates
    PubSub.subscribe('projects.updated', updateProjectSelector);

    // populate on first load
    updateProjectSelector(projectData.getAll());
  }

  function updateProjectSelector(projectArr) {
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
  }

  return { init };
})();
