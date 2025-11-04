import { PubSub } from './pubsub.js';

export const projectData = (function() {
  let projectArr = [];

  function loadFromStorage(storedProjects){
    projectArr = storedProjects;
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

  function init(initialProjects = []) {
    projectArr = [...initialProjects];
    // pass in project array as well as the dom element selector name since there are multiple selectors
    const selectorName = 'task_project_select' //in initiliation, this main form slector us the relevant dom element
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectMenuName: selectorName});
    PubSub.subscribe("project.newsubmitted", addProject);
  }

  return { addProject, getAll, init, loadFromStorage};
})();
