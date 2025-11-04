import { PubSub } from './pubsub.js';

export const projectData = (function() {
  const projectArr = [];

  function loadFromStorage(storedProjects) {
    if (!Array.isArray(storedProjects)) return;
    projectArr.length = 0; //clear array             
    projectArr.push(...storedProjects); //repopulate with array from local storage
  }

  function addProject({ projectName, projectSelectMenuName }) {
    projectArr.push(projectName);
    console.log("pushed project with select menu name:", projectName, projectSelectMenuName)
    // pass in project array as well as the dom element selector name since there are multiple selectors
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectMenuName: projectSelectMenuName}); 
  }

  function getAll() {
    return [...projectArr];
  }

  function init() {
    if (projectArr.length === 0) projectArr[0] = 'Inbox';
    // pass in project array as well as the dom element selector name since there are multiple selectors
    const selectorName = 'task_project_select' //in initiliation, this main form slector us the relevant dom element
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectMenuName: selectorName});
    PubSub.subscribe("project.newsubmitted", addProject);
  }

  return { addProject, getAll, init, loadFromStorage};
})();
