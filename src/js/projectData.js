import { PubSub } from './pubsub.js';

export const projectData = (function() {
  const projectArr = [];

  function init() {
    if (projectArr.length === 0) { 
      projectArr[0] = 'Inbox';
    }
    PubSub.publish('projects.updated', [...projectArr]);
    PubSub.subscribe('project.newRequested', addProject);
    PubSub.subscribe('project.editRequested', editProject);
    PubSub.subscribe("project.deleteConfirmed", deleteProject);
  }
  
  //loadfromStorage gets called in index.js before this module is initiatlized 
  function loadFromStorage(storedProjects) {
    if (!Array.isArray(storedProjects)) return;
    projectArr.length = 0; //clear array             
    projectArr.push(...storedProjects); //repopulate with array from local storage
  }

  function deleteProject(projectName){
    const index = projectArr.indexOf(projectName);
    if (index !== -1) {
      projectArr.splice(index, 1);
    }
    //publish array updated event so main form proj select menu and project view can be refreshed
    // and local storage can be updated
    PubSub.publish('projects.updated',  [...projectArr]); 
    //publish delete event specfics so taskData can update its array
    PubSub.publish('project.deleted', projectName);
  }

  function addProject(projectName) {
    // only add project if it does not already exist in array
    if (!projectArr.includes(projectName)) {
      projectArr.push(projectName);
      //re-sort array 
      sortProjectsArr();
      //publish array updated event so main form proj select menu and project view can be refreshed
      // and local storage can be updated
      PubSub.publish('projects.updated', [...projectArr]); 
      //publish new project added event so proj selector menu can display it as selected option
      PubSub.publish('project.added', projectName)
    } else {
        alert("That project name already exists. Please choose a unique name.");
        // Publish no project was added if duplicate so main form select menu can be reset
        PubSub.publish('project.dupNotAdded', {})
    }
  }

  function editProject({ origProjectName, editedProjectName }){
    //edit projectname as long as the name is not already taken
    if (!projectArr.includes(editedProjectName)){
      projectArr.forEach((item, index) => {
        if (item === origProjectName) {
          projectArr[index] = editedProjectName;
        }
      });
      //re-sort array after name change
      sortProjectsArr();
      //publish array updated event so main form proj select menu and project view can be refreshed
      // and local storage can be updated
      PubSub.publish('projects.updated', [...projectArr]);
      //publish projects edited event so taskData can update relevant tasks with new project name
      PubSub.publish('project.edited', { origProjectName, editedProjectName }); 
    } else {
        alert("That project name already exists. Please choose a unique name.");
    }
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
