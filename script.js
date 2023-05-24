const filterDropdownItems = document.querySelectorAll('#filter .dropdown-item');
const todosContainer = document.getElementById('displayToDo');

// Add click event listeners to filter dropdown items
for (const item of filterDropdownItems) {
  item.addEventListener('click', function(event) {
    // prevent the default navigation or page reload that would normally occur when a filter dropdown item is clicked
    event.preventDefault(); 
    const filter = this.getAttribute('data-filter'); // 1,2,3,etc for User ID | completed & not-completed for Status

    // Remove 'active' class from all dropdown items
    for (const item of filterDropdownItems) {
      item.classList.remove('active');
    }

    // Add 'active' class to the clicked dropdown item
    this.classList.add('active');

    // Apply the selected filter
    applyFilter(filter);
  });
}

function applyFilter(filter) {
  const tbody = todosContainer.querySelector('tbody');
  tbody.innerHTML = '';

  // Fetch todos from the API
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(data => {
      let filteredTodos = [];

      // Iterate over each todo item
      for (const todo of data) {
        // Check if the filter matches the todo item
        if (filter === '') {
          filteredTodos.push(todo);
        } else if (filter === 'completed' && todo.completed) {
          filteredTodos.push(todo);
        } else if (filter === 'not-completed' && !todo.completed) {
          filteredTodos.push(todo);
        } else if (filter !== 'completed' && filter !== 'not-completed') {
          const userId = parseInt(filter);
          if (todo.userId === userId) {
            filteredTodos.push(todo);
          }
        }
      }

      // Iterate over filtered todos and create table rows
      for (const todo of filteredTodos) {
        const todoItem = document.createElement('tr');

        // Create a checkmark symbol based on the todo completion status using bootstrap icons
        const checkmark = todo.completed ? '<i class="bi bi-check2"></i>' : '<i class="bi bi-x-lg"></i>';

        // Populate the table row with todo title and checkmark
        todoItem.innerHTML = `
          <td>${todo.userId}: ${todo.title}</td>
          <td class="text-center">${checkmark}</td>
        `;

        // Append the todo item to the table body
        tbody.appendChild(todoItem);
      }

      // Display the table
      todosContainer.style.display = 'table';
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

