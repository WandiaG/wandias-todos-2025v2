document.addEventListener('DOMContentLoaded', () => {
    setDateToToday(); // Set the date input to today

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (storedTasks.length) {
        storedTasks.forEach((task) => tasks.push(task));
        updateTaskList();
        updateStats();
    }

    const dateInput = document.getElementById("date-time");
    dateInput.addEventListener("change", () => {
        updateTaskList();
        updateStats();
    }); // Update task list and stats when date changes

    document.getElementById("prev-page").addEventListener("click", prevPage);
    document.getElementById("next-page").addEventListener("click", nextPage);
});


let currentPage = 1;
const tasksPerPage = 5;

function setDateToToday() {
    const dateInput = document.getElementById("date-time");
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

const tasks = [];

function saveTask() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addNewTask = document.getElementById("add-task");
addNewTask.addEventListener("click", (e) => {
    e.preventDefault();
    addATask();
});

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTask();
}

function editTask(index) {
    const taskInput = document.getElementById("task-input");
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTask();
}

function updateStats() {
    const selectedDate = document.getElementById("date-time").value;
    const filteredTasks = selectedDate 
        ? tasks.filter(task => new Date(task.date).toISOString().split('T')[0] === selectedDate) 
        : tasks;

    const taskCompleted = filteredTasks.filter(task => task.complete).length;
    const totalTasks = filteredTasks.length;
    const progress = totalTasks > 0 ? (taskCompleted / totalTasks) * 100 : 0;

    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers').innerText = `${taskCompleted} / ${totalTasks}`;
}

function addATask() {
    const currentDate = new Date().toLocaleDateString();
    const inputTask = document.getElementById("task-input");
    const task = inputTask.value;
    
    if (task.length > 0) {
        tasks.push({ text: task, complete: false, date: currentDate });
    }
    inputTask.value = "";
    updateTaskList();
    updateStats();
    saveTask();
}

function updateTaskList() {
    const taskslist = document.getElementById("task-UL");
    taskslist.innerHTML = "";

    const selectedDate = document.getElementById("date-time").value;
    const filteredTasks = selectedDate 
        ? tasks.filter(task => new Date(task.date).toISOString().split('T')[0] === selectedDate) 
        : tasks;

    const start = (currentPage - 1) * tasksPerPage;
    const end = start + tasksPerPage;
    const paginatedTasks = filteredTasks.slice(start, end);

    paginatedTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.className = "flex items-center justify-between gap-3";
        taskItem.innerHTML = `
            <input class="peer flex items-center justify-evenly gap-2" type="checkbox" name="checkbox-item" id="checkbox-item-${start + index}">
            <label class="flex flex-grow items-center justify-left peer-checked:line-through peer-checked:text-green-500" for="checkbox-item-${start + index}">${task.text}</label>
            <label for="date">${task.date}</label>
            <div class="flex items-center justify-center flex-col">
                <button onclick="editTask(${start + index})"> <i class="fa-solid fa-pen text-green-500"></i> </button>
                <button onclick="deleteTask(${start + index})"> <i class="fa-solid fa-trash-can text-[var(--pink-color)]"></i> </button>
            </div>
        `;

        const checkbox = taskItem.querySelector(`#checkbox-item-${start + index}`);
        checkbox.checked = task.complete;
        checkbox.addEventListener('change', () => {
            task.complete = checkbox.checked;
            if (checkbox.checked) {
                taskItem.querySelector("label[for='checkbox-item-"+(start + index)+"']").classList.add("line-through", "text-green-500");
            } else {
                taskItem.querySelector("label[for='checkbox-item-"+(start + index)+"']").classList.remove("line-through", "text-green-500");
            }
            saveTask();
            updateStats();
        });

        taskslist.append(taskItem);
    });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTaskList();
    }
}

function nextPage() {
    const selectedDate = document.getElementById("date-time").value;
    const filteredTasks = selectedDate 
        ? tasks.filter(task => new Date(task.date).toISOString().split('T')[0] === selectedDate) 
        : tasks;

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateTaskList();
    }
}
