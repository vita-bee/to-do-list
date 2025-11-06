import "../styles.css";
import { PubSub } from './pubsub.js';
import { navHandler } from "./navHandler.js";
// import { taskData } from './taskData.js'

export const renderMonthView = (function() {
    let currentYear;
    let currentMonth;

  function init(taskArr) {
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth(); // 0 = Jan, 1 = Feb, etc.
    renderMonthGrid(currentMonth, currentYear);
    renderTasks(taskArr);
    PubSub.subscribe('tasks.updated', handleTasksUpdated);
    PubSub.subscribe('backArrow.clicked', renderPreviousMonth);
    PubSub.subscribe('forwardArrow.clicked', renderNextMonth);
  }

  function handleTasksUpdated(taskArr) {
    // only re-render updated tasks if the month view is active
    if (navHandler.getActiveTab() === 'monthView') {
      renderTasks(taskArr);
    }
  }

  function renderPreviousMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear = currentYear - 1;
    } else {
      currentMonth = currentMonth - 1;
    }
    renderMonthGrid(currentMonth, currentYear);
  }

  function renderNextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear = currentYear + 1;
    } else {
      currentMonth = currentMonth + 1;
    }
    renderMonthGrid(currentMonth, currentYear);
  }


  function parseLocalDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  }

  function renderTasks(taskArr) {
    document.querySelectorAll('.taskItemContainer').forEach(element => element.remove()); // clear all tasks in month
    taskArr.forEach(task => {
      const taskDate = parseLocalDate(task.dueDate); //have to parse date due to time zone issues
      const taskDay = taskDate.getDate();
      const taskMonth = taskDate.getMonth(); // 0-11
      const taskYear = taskDate.getFullYear();  

      if ((taskMonth === currentMonth) && (taskYear === currentYear)){
        // console.log("taskDay:", taskDay);
        // console.log("tasktitle:", task.title);
        // console.log("taskdueDate:", task.dueDate);
        // console.log("taskproject:", task.project);
        // console.log("taskDescrip:", task.descrip);
        const taskDayCell = document.getElementById(taskDay);
        
        const taskItemContainer = document.createElement('div');
        taskItemContainer.classList.add('taskItemContainer');
        taskItemContainer.id = task.id;
        if (task.priority === "High") {
          taskItemContainer.classList.add('priorityHigh')
        } else if (task.priority === "Low"){
          taskItemContainer.classList.add('priorityLow')
        } 
        const taskTitleP = document.createElement('p');
        taskTitleP.classList.add('taskTitle');
        taskTitleP.textContent = task.title;
        taskItemContainer.appendChild(taskTitleP);

        const taskProjectNameP = document.createElement('p');
        taskProjectNameP.classList.add('taskProjectName');
        taskProjectNameP.textContent = task.project;
        taskItemContainer.appendChild(taskProjectNameP);

        const taskDescripP = document.createElement('p');
        taskDescripP.classList.add('taskDescrip');
        taskDescripP.textContent = task.descrip;

        if (task.is_done) {
          taskItemContainer.classList.add("doneTask");
        } else {
          taskItemContainer.classList.remove("doneTask");
        }

        taskItemContainer.appendChild(taskDescripP);

        taskDayCell.appendChild(taskItemContainer);
      }

    });
  }
  
  function getMonthName(monthNumber) {
    const date = new Date(2000, monthNumber); // year doesn't matter
    return date.toLocaleString('default', { month: 'long' }); 
  }

  function renderMonthGrid(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const monthName = getMonthName(month);
    const viewContainer = document.getElementById("viewContainer");
    
    //first clear the current  view
    while (viewContainer.firstChild) {
      viewContainer.removeChild(viewContainer.firstChild);
    }

    const monthContainer = document.createElement("div");
    monthContainer.id = "monthContainer";

    const monthHeader = document.createElement("div");
    monthHeader.id = "monthHeader";
    const backArrow = document.createElement("div");
    backArrow.id = "backArrow";
    const monthNameDiv = document.createElement("div");
    monthNameDiv.id = "monthNameDiv";
    monthNameDiv.textContent = `${monthName}  ${year}`;
    const forwardArrow = document.createElement("div");
    forwardArrow.id = "forwardArrow";
    monthHeader.appendChild(backArrow);
    monthHeader.appendChild(monthNameDiv);
    monthHeader.appendChild(forwardArrow);

    monthContainer.appendChild(monthHeader);
    
    const daysHeader = document.createElement("div");
    daysHeader.id = "daysHeader";
    const sundayP = document.createElement("p");
    sundayP.classList.add("dayheader");
    sundayP.textContent = "Sunday";
    daysHeader.appendChild(sundayP);
    const mondayP = document.createElement("p");
    mondayP.classList.add("dayheader");
    mondayP.textContent = "Monday";
    daysHeader.appendChild(mondayP);
    const tuesdayP = document.createElement("p");
    tuesdayP.classList.add("dayheader");
    tuesdayP.textContent = "Tuesday";
    daysHeader.appendChild(tuesdayP);
    const wednesdayP = document.createElement("p");
    wednesdayP.classList.add("dayheader");
    wednesdayP.textContent = "Wednesday";
    daysHeader.appendChild(wednesdayP);
    const thursdayP = document.createElement("p");
    thursdayP.classList.add("dayheader");
    thursdayP.textContent = "Thursday";
    daysHeader.appendChild(thursdayP);
    const fridayP = document.createElement("p");
    fridayP.classList.add("dayheader");
    fridayP.textContent = "Friday";
    daysHeader.appendChild(fridayP);
    const saturdayP = document.createElement("p");
    saturdayP.classList.add("dayheader");
    saturdayP.textContent = "Saturday";
    daysHeader.appendChild(saturdayP);

    monthContainer.appendChild(daysHeader);
    
    const monthGrid = document.createElement("div");
    monthGrid.id = "monthGrid";

    for (let i = 0; i < startDay; i++) {
      const blankCell = document.createElement('div');
      blankCell.classList.add('blankCell');
      monthGrid.appendChild(blankCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("dayCell");
        dayCell.id = day;
        const dayNum = document.createElement("p");
        dayNum.classList.add("dayNum");
        dayNum.textContent = day;
        dayCell.appendChild(dayNum);
        monthGrid.appendChild(dayCell);
    }

    monthContainer.appendChild(monthGrid);
    viewContainer.appendChild(monthContainer);
    //taskData.js listens for monthView Change and publishes its own msg that tasks are updated 
    // --this msg is then heard by monthView with taskArr passed in and this is used to then rendersTasks
    // on changed monthview
    PubSub.publish('monthView.changed', {}); 
}
return {init};

})()