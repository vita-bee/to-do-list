import "../styles.css";
import { format, addDays } from 'date-fns';
import { PubSub } from './pubsub.js';

export const renderMonthView = (function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 = Jan, 1 = Feb, etc.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    console.log("days in month:", daysInMonth);
    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    console.log("current month:", currentMonthName); 

  function init() {
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