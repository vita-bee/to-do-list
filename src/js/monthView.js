import "../styles.css";
import { format, addDays } from 'date-fns';
import { PubSub } from './pubsub.js';

export const renderMonthView = (function() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 = Jan, 1 = Feb, etc.
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    console.log("days in month:", daysInMonth);
    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    console.log("current month:", currentMonthName); 

  function init() {
    renderMonthGrid();
    PubSub.subscribe('tasks.updated', renderTasks);
  }

  function parseLocalDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  }

  function renderTasks(taskArr) {

    document.querySelectorAll('.taskItemContainer').forEach(el => el.remove()); // clear all tasks in month
    taskArr.forEach(task => {
      const taskDate = parseLocalDate(task.dueDate); //have to parse date due to time zone issues
      const taskDay = taskDate.getDate();
      const taskMonth = taskDate.getMonth(); // 0-11
      const taskYear = taskDate.getFullYear();  
      // const taskDateStr = task.dueDate;             
      // const taskDateObj = new Date(taskDateStr);     // convert to Date object
      // const taskDay = taskDateObj.getDate();
      // const taskMonth = taskDateObj.getMonth();      // returns 0–11 (0 = January)
      // const taskYear = taskDateObj.getFullYear(); 

      if ((taskMonth === currentMonth) && (taskYear === currentYear)){
        console.log("taskDay:", taskDay);
        console.log("tasktitle:", task.title);
        console.log("taskdueDate:", task.dueDate);
        console.log("taskproject:", task.project);
        console.log("taskDescrip:", task.descrip);
        const taskDayCell = document.getElementById(taskDay);
        
        const taskItemContainer = document.createElement('div');
        taskItemContainer.classList.add('taskItemContainer');
        taskItemContainer.id = task.id;

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
        taskItemContainer.appendChild(taskDescripP);

        taskDayCell.appendChild(taskItemContainer);
      }

    });
  }

  function renderMonthGrid() {
    console.log("rendering month grid");
    const viewContainer = document.getElementById("viewContainer");

    const monthContainer = document.createElement("div");
    monthContainer.id = "monthContainer";

    const monthHeader = document.createElement("div");
    monthHeader.id = "monthHeader";
    const backArrow = document.createElement("div");
    backArrow.id = "backArrow";
    const monthNameDiv = document.createElement("div");
    monthNameDiv.id = "monthNameDiv";
    monthNameDiv.textContent = currentMonthName;
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
}
return {init};

})()