// Gets the task list saved in localStorage or creates an empty list if it does not exist
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function viewTasks(){
    // Select the elemnts from the task list
    const taskList = document.querySelector('.list');
    taskList.innerHTML = '';

    // Add event listeners to the tasks buttons
    tasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = task.completed ? 'verified' : '';
        taskElement.innerHTML = `<i class="check">&#x2714;</i> ${task.text} <i class="remove">&#x2717;</i>`;
        taskList.appendChild(taskElement);

        const checkButton = taskElement.querySelector('.check');
        const removeButton = taskElement.querySelector('.remove');

        checkButton.addEventListener('click', function() {
            task.completed = !task.completed;
            viewTasks();
            updateTasks();
        });

        removeButton.addEventListener('click', function() {
            tasks = tasks.filter(t => t !== task);
            viewTasks();
            updateTasks();
        });
    });
}

function updateTasks() {
    let string = JSON.stringify(tasks);
    localStorage.setItem('tasks', string);
    /* console.log(tasks); */
}

// Event listener to the form to add new task
const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const newTaskText = document.getElementById('ntask').value;
    if (newTaskText) {
        const newTask = {
            text: newTaskText,
            completed: false
        };

        tasks.push(newTask);
        viewTasks();
        updateTasks();

        // Clean the text input when the task is added
        document.getElementById('ntask').value = '';
    }
});

viewTasks();