import { PubSub } from './pubsub.js';

export const projectData = (function() {
  let projectArr = [];

  function addProject(name) {
    projectArr.push(name);
    PubSub.publish('projects.updated', [...projectArr]); // publish copy
  }

  function getAll() {
    return [...projectArr];
  }

  function init(initialProjects = []) {
    projectArr = [...initialProjects];
    PubSub.publish('projects.updated', [...projectArr]);
  }

  return { addProject, getAll, init };
})();
