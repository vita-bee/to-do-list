import { taskData } from "./taskData";
import { projectData } from './projectData';
import { PubSub } from "./pubsub";

export const localStorageHandler = (function() {

    function updateTaskArrInLocalStorage (taskArr) {
        localStorage.setItem('tasks', JSON.stringify(taskArr));
    }

    function updateProjArrInLocalStorage ({projectArr}) {
        localStorage.setItem('projects', JSON.stringify(projectArr));   
    }

    function loadProjsAndTasksFromLocalStorage () {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
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