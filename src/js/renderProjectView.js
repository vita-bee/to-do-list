import "../styles.css";
import { format, addDays } from 'date-fns';
import { PubSub } from './pubsub.js';
// import { taskData } from './taskData.js'

export const renderProjectView = (function() {

  function init(projectArr) {
    renderProjects(projectArr);
  }

  function renderProjects(projArr) {
    console.log("rendering project view");
    const viewContainer = document.getElementById("viewContainer");
    // Clear current view
    while (viewContainer.firstChild) {
        viewContainer.removeChild(viewContainer.firstChild);
    }
    // Create a wrapper div for projects
    const div = document.createElement("div");
    div.classList.add("projectsView"); // class for styling
    projArr.forEach(projectName => {
        const p = document.createElement("p");
        p.textContent = projectName;
        div.appendChild(p);
    });
    viewContainer.appendChild(div);
  }

  return {init};

})();