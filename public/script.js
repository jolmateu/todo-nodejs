// Gets the task list saved in MongoDB
document.addEventListener('DOMContentLoaded', function() {
  // Fetch tasks from the server and display them
  fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
      viewTasks(tasks);
    })
    .catch(error => console.error(error));

  function viewTasks(tasks){
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
              updateTask(task);
          });

          removeButton.addEventListener('click', function() {
              removeTask(task);
          });
      });
  }

function updateTask(task) {
  fetch(`/tasks/${task._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  .then(response => response.json())
  .then(updatedTask => {
    viewTasks(updatedTask);
  })
  .catch(error => console.error(error));
  console.log("Error en PUT");
  console.log(updatedTask);
}

function removeTask(task) {
  fetch(`/tasks/${task._id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(updatedTasks => {
    viewTasks(updatedTasks);
  })
  .catch(error => console.error(error));
}

// Event listener to the form to add new task
const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const newTaskText = document.getElementById('ntask').value;
    if (newTaskText) {
        const newTask = {
          _id: Math.floor(Math.random() * 1000000).toString(),
          text: newTaskText,
          completed: false
        };

        fetch('/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTask)
        })
        .then(response => response.json())
        .then(updatedTasks => {
          viewTasks(updatedTasks);
        })
        .catch(error => console.error(error));

        // Clean the text input when the task is added
        document.getElementById('ntask').value = '';
    }
  });
});