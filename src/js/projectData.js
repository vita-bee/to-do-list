import { PubSub } from './pubsub.js';

export const projectData = (function() {
  let projectArr = [];

  function addProject({ projectName, projectSelectorName }) {
    projectArr.push(projectName);
    // pass in project array as well as the dom element selector name since there are multiple selectors
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectorName: projectSelectorName}); 
  }

  function getAll() {
    return [...projectArr];
  }

  function init(initialProjects = []) {
    projectArr = [...initialProjects];
    // pass in project array as well as the dom element selector name since there are multiple selectors
    const selectorName = 'task_project_select' //in initiliation, this main form slector us the relevant dom element
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectorName: selectorName});
    PubSub.subscribe("project.newsubmitted", addProject);
  }

  return { addProject, getAll, init };
})();
