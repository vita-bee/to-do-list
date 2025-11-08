import { taskData } from "./taskData";
import { projectData } from './projectData';
import { PubSub } from "./pubsub";

export const localStorageHandler = (function() {

    function updateTaskArrInLocalStorage (taskArr) {
        localStorage.setItem('tasks', JSON.stringify(taskArr));
    }

    function updateProjArrInLocalStorage (projectArr) {
        localStorage.setItem('projects', JSON.stringify(projectArr));   
    }

    function loadProjsAndTasksFromLocalStorage() {
    let storedTasks = localStorage.getItem('tasks');
    let storedProjects = localStorage.getItem('projects');

    //added error catching because local storage data got corrupted somehow
    try {
        storedTasks = storedTasks ? JSON.parse(storedTasks) : [];
    } catch (e) {
        console.warn("Invalid tasks in localStorage, resetting to []");
        storedTasks = [];
    }

    try {
        storedProjects = storedProjects ? JSON.parse(storedProjects) : [];
    } catch (e) {
        console.warn("Invalid projects in localStorage, resetting to []");
        storedProjects = [];
    }

    taskData.loadFromStorage(storedTasks);
    projectData.loadFromStorage(storedProjects);
}

    function init () {
        loadProjsAndTasksFromLocalStorage();
        PubSub.subscribe('tasks.updated', updateTaskArrInLocalStorage)
        PubSub.subscribe('projects.updated', updateProjArrInLocalStorage)
    }

    return {init, updateTaskArrInLocalStorage, updateProjArrInLocalStorage };

})();