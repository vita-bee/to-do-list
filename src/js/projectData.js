import { PubSub } from './pubsub.js';

export const projectData = (function() {
  const projectArr = [];
  const selectorName = 'task_project_select'; //main form selector - requires refreshing on changes to projects list

  function init() {
    if (projectArr.length === 0) projectArr[0] = 'Inbox';
    // pass in project array as well as the dom element selector name since there are multiple selectors
    const selectorName = 'task_project_select' //in initialization, this main form selector menu is the relevant dom element
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectMenuName: selectorName});
    PubSub.subscribe('project.newsubmitted', addProject);
    PubSub.subscribe('project.editSubmitted', editProject);
    PubSub.subscribe("project.deleteRequested", deleteProject);
  }

  function loadFromStorage(storedProjects) {
    if (!Array.isArray(storedProjects)) return;
    projectArr.length = 0; //clear array             
    projectArr.push(...storedProjects); //repopulate with array from local storage
  }

  function deleteProject({origProjectName}){
    const index = projectArr.indexOf(origProjectName);
    if (index !== -1) {
      projectArr.splice(index, 1);
    }
    //publish array updated event so main proj select menu and project view can be refreshed
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectMenuName: selectorName}); 
    
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

  function editProject({ origProjectName, editedProjectName }){
    projectArr.forEach((item, index) => {
      if (item === origProjectName) {
        projectArr[index] = editedProjectName;
      }
    });
    //re-sort array after name change
    sortProjectsArr();
    //publish array updated event so main proj select menu and project view can be refreshed
    PubSub.publish('projects.updated', {projectArr: [...projectArr], projectSelectMenuName: selectorName}); 
  }

  function sortProjectsArr(){
    //sort project names ascending order but always keep 'Inbox' first
    projectArr.sort((a, b) => {
      if (a === "Inbox") return -1;  // a should come first
      if (b === "Inbox") return 1;   // b should come first
      return a.localeCompare(b);     // otherwise sort alphabetically
    });
  }

  function getAllProjectsSorted() {
    sortProjectsArr();
    return [...projectArr];
  }

  

  return { addProject, getAllProjectsSorted, init, loadFromStorage};
})();
