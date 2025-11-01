



document.getElementById('addTaskBtn').onclick = function(event) {
    event.preventDefault();
    const form = document.getElementById('addTaskForm');
    const formData = new FormData(form);
    const taskTitle = formData.get('task_title');
    const taskDue = formData.get('due_date');
    const taskPriority = formData.get('priority_select');
    const taskProject = formData.get('task_project_select');
    const taskDescrip = formData.get('task_descrip');
        
    getNewTask(taskTitle, taskDue, taskPriority, taskProject, taskDescrip);
       
    console.log('taskTitle:', taskTitle);
    console.log('taskDue:', taskDue);
    console.log('taskPriority:', taskPriority);
    console.log('taskProject: ', taskProject);
    console.log('taskDescrip:', taskDescrip);
    
    form.reset(); 
    
}