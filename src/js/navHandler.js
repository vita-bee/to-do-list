import { renderMonthView } from "./monthView";
import { renderProjectView } from "./projectView"
import { projectData } from "./projectData";
import { taskData } from "./taskData";


export const navHandler = (function() {
    // Active tab default is monthView which is displayed on page load
    // activeTab tracks the view to be rendered/refreshed when tasks nad projects get updated
    // and display needs to be re-rendered
  let activeTab = 'monthView'; 
  const content = document.getElementById("viewContainer");
  const navButtons = document.querySelectorAll('.navBtn');

  function init() {
    navButtons.forEach(navBtn => {
        navBtn.addEventListener('click', () => {
            document.querySelectorAll('.navBtn').forEach(navBtn => navBtn.classList.add('inActiveNavTab'));
            if (navBtn.textContent==="Project View") {
                navBtn.classList.remove('inActiveNavTab');
                navBtn.classList.add('activeNavTab');
                content.replaceChildren();
                activeTab = 'projectView'
                renderProjectView.init(projectData.getAllProjectsSorted(), taskData.getAllTasksSorted());
            } else if (navBtn.textContent==="Month View") {
                navBtn.classList.remove('inActiveNavTab');
                navBtn.classList.add('activeNavTab');
                content.replaceChildren();
                activeTab = 'monthView'
                renderMonthView.init(taskData.getAllTasksSorted());
            } 
        });
    });
  }
  
  function getActiveTab(){
    return  activeTab;
  }

  return {init, getActiveTab};

})()