import { PubSub } from './pubsub.js';

export const projectData = (function() {
  const projectArr = [];

  function loadFromStorage(storedProjects) {
    if (!Array.isArray(storedProjects)) return;
    projectArr.length = 0; //clear array             
    projectArr.push(...storedProjects); //repopulate with array from local storage
  }

  function addProject({ projectName, projectSelectMenuName }) {
    // only add project if it does not already exist in array
    if (!projectArr.includes(projectName)) {
      projectArr.push(projectName);
      // publish project array as well as the dom element selector name since there are multiple selectors
      PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectMenuName: projectSelectMenuName}); 
    }
    // to add later: need to publish for when its a duplicate project so that the select menu can be 
    // updated to show that project name.
  }

  function getAllProjectsSorted() {
    //sort project names ascending order but always keep 'Inbox' first
    projectArr.sort((a, b) => {
      if (a === "Inbox") return -1;  // a should come first
      if (b === "Inbox") return 1;   // b should come first
      return a.localeCompare(b);     // otherwise sort alphabetically
    });
    return [...projectArr];
  }

  function init() {
    if (projectArr.length === 0) projectArr[0] = 'Inbox';
    // pass in project array as well as the dom element selector name since there are multiple selectors
    const selectorName = 'task_project_select' //in initialization, this main form selector menu is the relevant dom element
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectMenuName: selectorName});
    PubSub.subscribe("project.newsubmitted", addProject);
  }

  return { addProject, getAllProjectsSorted, init, loadFromStorage};
})();
