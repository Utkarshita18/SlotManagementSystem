document.addEventListener('DOMContentLoaded', function() {
    // Check if the page was opened from the student or faculty dashboard
    const referrer = document.referrer;
    console.log('Referrer:', referrer);

    if (referrer.includes('front.html') || referrer.includes('student.html')) {
        // This is a student, hide the faculty-only elements
        console.log('Student detected, hiding faculty-only elements.');
        document.body.id = 'student-dashboard';

        const facultyElements = document.querySelectorAll('.faculty-only');
        facultyElements.forEach(function(element) {
            element.style.display = 'none';
        });
    } else if (referrer.includes('faculty.html')) {
        // This is a faculty member, show all elements
        console.log('Faculty detected.');
        document.body.id = 'faculty-dashboard';
    }
});



document.addEventListener('DOMContentLoaded', async () => {
    const year = document.querySelector('meta[name="year"]').content;
    const type = document.querySelector('meta[name="type"]').content;

    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
        console.error('Calendar element not found');
        return;
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: async function(fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch(`/${year}/${type}/calendar/events`); // Added division param as an example
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                
                const formattedData = data.map(slot => ({
                    title: slot.title,
                    start: slot.start,
                    end: slot.end,
                    extendedProps: {
                        courseName: slot.extendedProps.courseName,
                        division: slot.extendedProps.division,
                        batch: slot.extendedProps.batch,
                        venue: slot.extendedProps.venue,
                        desc: slot.extendedProps.desc
                    }, 
                    description: slot.description
                }));
                successCallback(formattedData);
            } catch (error) {
                console.error('Error fetching slots:', error);
                failureCallback(error);
            }
        },
        eventContent: function(info) {
            const { event } = info;
            return {
                html: `
                    <strong>${event.title}</strong>
                    
                    <div>${formatTime(event.start)}<div>
                    <div>${formatTime(event.end)}<div>
                    <div>Course: ${event.extendedProps.courseName}</div>
                    <div>${event.extendedProps.division ? 'Division: ' + event.extendedProps.division : ''}</div>
                    <div>${event.extendedProps.batch ? 'Batch: ' + event.extendedProps.batch : ''}</div>
                    <div>Venue: ${event.extendedProps.venue}</div>
                    <div>${event.extendedProps.desc}</div>
                    
                    
                `
            };
        },
    });

    calendar.render();
    function formatTime(date) {
        if (!date) {
            return 'Invalid time';
        }
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };  // 12-hour format
        return new Date(date).toLocaleTimeString([], options);  // Use toLocaleTimeString to format time properly
    }  
});

/*document.addEventListener('DOMContentLoaded', async () => {
    const year = document.querySelector('meta[name="year"]').content;
    const type = document.querySelector('meta[name="type"]').content;

    // Fetch slots and populate the table
    async function fetchSlots() {
        try {
            const response = await fetch(`/${year}/${type}/edit/slots`);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to fetch slots: ${response.statusText}`);
            }
            const slots = await response.json();
            const tableElement = document.getElementById('slotsTable');

            if (tableElement) {
                const tableBody = tableElement.querySelector('tbody');
                if (tableBody) {
                    tableBody.innerHTML = ''; // Clear existing rows
                    slots.forEach(slot => {
                        const row = document.createElement('tr');
                        row.classList.add('slot');
                        row.setAttribute('data-id', slot._id);
                        row.innerHTML = `
                            <td>${slot.facultyName}</td>
                            <td>${slot.courseName}</td>
                            <td>${slot.division}</td>
                            <td><input type="date" value="${slot.date}" class="edit-date" data-id="${slot._id}"></td>
                            <td><input type="time" value="${slot.startTime}" class="edit-startTime" data-id="${slot._id}"></td>
                            <td><input type="time" value="${slot.endTime}" class="edit-endTime" data-id="${slot._id}"></td>
                            <td><input type="text" value="${slot.venue}" class="edit-venue" data-id="${slot._id}"></td>
                            <td><input type="text" value="${slot.desc}" class="edit-desc" data-id="${slot._id}"></td>
                            <td><button class="btn" data-action="edit" data-id="${slot._id}">Edit</button></td>
                            <td><button class="btn" data-action="delete" data-id="${slot._id}">Delete</button></td>
                        `;
                        tableBody.appendChild(row);
                    });

                    // Add event listeners for edit and delete buttons
                    document.querySelectorAll('button[data-action="edit"]').forEach(button => {
                        button.addEventListener('click', (e) => handleEditButtonClick(e.target));
                    });

                    document.querySelectorAll('button[data-action="delete"]').forEach(button => {
                        button.addEventListener('click', (e) => handleDeleteButtonClick(e.target));
                    });
                } else {
                    console.error('Table body not found!');
                }
            } else {
                console.error('Table element not found!');
            }
            console.log('Received slots:', slots);
        } catch (error) {
            console.error('Error fetching slots:', error);
            alert('An error occurred while fetching slots.'); // Error alert
        }
    }

    // Handle edit button click
    function handleEditButtonClick(button) {
        const id = button.getAttribute('data-id');
        const row = document.querySelector(`tr.slot[data-id="${id}"]`);

        const date = document.querySelector(`.edit-date[data-id="${id}"]`).value;
        const startTime = document.querySelector(`.edit-startTime[data-id="${id}"]`).value;
        const endTime = document.querySelector(`.edit-endTime[data-id="${id}"]`).value;
        const venue = document.querySelector(`.edit-venue[data-id="${id}"]`).value;
        const desc = document.querySelector(`.edit-desc[data-id="${id}"]`).value;

        fetch(`/${year}/${type}/edit/slot/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, startTime, endTime, venue, desc })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                fetchSlots(); // Refresh the slots list after a successful edit
            }else {
                throw new Error('Error editing slot');
            }
        })
        .catch(error => {
            console.error('Error updating slot:', error);
            alert('An error occurred. Please try again.'); // Error alert
        });
    }

    // Handle delete button click
    function handleDeleteButtonClick(button) {
        const id = button.getAttribute('data-id');
        
        fetch(`/${year}/${type}/edit/slot/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                fetchSlots();
                // Remove the deleted slot from the DOM
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                    row.remove();
                }
            }else {
                throw new Error('Error deleting slot');
            }
        })
        .catch(error => {
            console.error('Error deleting slot:', error);
            alert('An error occurred. Please try again.'); // Error alert
        });
    }

    fetchSlots();
})*/
/*document.addEventListener('DOMContentLoaded', async () => {
    const year = document.querySelector('meta[name="year"]').content;
    const type = document.querySelector('meta[name="type"]').content;

    // Fetch slots and populate the table
    async function fetchSlots() {
        try {
            const response = await fetch(`/${year}/${type}/edit/slots`);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to fetch slots: ${response.statusText}`);
            }

            const slots = await response.json();
            populateSlotsTable(slots); // Populate table with slot data

        } catch (error) {
            console.error('Error fetching slots:', error);
            alert('An error occurred while fetching slots.'); // Error alert
        }
    }

    // Populate the slots table
    function populateSlotsTable(slots) {
        const tableElement = document.getElementById('slotsTable');
        if (tableElement) {
            const tableBody = tableElement.querySelector('tbody');
            if (tableBody) {
                tableBody.innerHTML = ''; // Clear existing rows
                slots.forEach(slot => {
                    const row = document.createElement('tr');
                    row.classList.add('slot');
                    row.setAttribute('data-id', slot._id);
                    row.innerHTML = `
                        <td>${slot.facultyName}</td>
                        <td>${slot.courseName}</td>
                        <td>${slot.division}</td>
                        <td><input type="date" value="${slot.date}" class="edit-date" data-id="${slot._id}"></td>
                        <td><input type="time" value="${slot.startTime}" class="edit-startTime" data-id="${slot._id}"></td>
                        <td><input type="time" value="${slot.endTime}" class="edit-endTime" data-id="${slot._id}"></td>
                        <td><input type="text" value="${slot.venue}" class="edit-venue" data-id="${slot._id}"></td>
                        <td><input type="text" value="${slot.desc}" class="edit-desc" data-id="${slot._id}"></td>
                        <td><button class="btn edit-btn" data-id="${slot._id}" disabled>Edit</button></td>
                        <td><button class="btn delete-btn" data-id="${slot._id}">Delete</button></td>
                    `;
                    tableBody.appendChild(row);
                });

                // Add event listeners for edit and delete buttons
                tableBody.querySelectorAll('.edit-date, .edit-startTime, .edit-endTime, .edit-venue, .edit-desc').forEach(input => {
                    input.addEventListener('input', () => handleInputChange(input));
                });

                tableBody.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', () => handleEditButtonClick(button));
                });

                tableBody.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', () => handleDeleteButtonClick(button));
                });
            }
        }
    }

    // Handle input change - enable edit button if any changes are detected
    function handleInputChange(input) {
        const id = input.getAttribute('data-id');
        const row = document.querySelector(`tr.slot[data-id="${id}"]`);
        const editButton = row.querySelector('.edit-btn');
        editButton.disabled = false; // Enable the edit button once a change is made
    }

    // Handle edit button click
    function handleEditButtonClick(button) {
        const id = button.getAttribute('data-id');
        const row = document.querySelector(`tr.slot[data-id="${id}"]`);

        const updatedSlot = {
            date: row.querySelector(`.edit-date[data-id="${id}"]`).value,
            startTime: row.querySelector(`.edit-startTime[data-id="${id}"]`).value,
            endTime: row.querySelector(`.edit-endTime[data-id="${id}"]`).value,
            venue: row.querySelector(`.edit-venue[data-id="${id}"]`).value,
            desc: row.querySelector(`.edit-desc[data-id="${id}"]`).value
        };

        fetch(`/${year}/${type}/edit/slot/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSlot)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                button.disabled = true; // Disable edit button after successful update
            } else {
                throw new Error('Error editing slot');
            }
        })
        .catch(error => {
            console.error('Error updating slot:', error);
            alert('An error occurred. Please try again.'); // Error alert
        });
    }

    // Handle delete button click
    function handleDeleteButtonClick(button) {
        const id = button.getAttribute('data-id');

        if (confirm('Are you sure you want to delete this slot?')) {
            fetch(`/${year}/${type}/edit/slot/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message); // Show success message
                    const row = document.querySelector(`tr.slot[data-id="${id}"]`);
                    if (row) {
                        row.remove(); // Optimistic UI: Remove the deleted row
                    }
                } else {
                    throw new Error('Error deleting slot');
                }
            })
            .catch(error => {
                console.error('Error deleting slot:', error);
                alert('An error occurred. Please try again.'); // Error alert
            });
        }
    }

    // Initial fetch of slots
    fetchSlots();
});*/
document.addEventListener('DOMContentLoaded', async () => {
    const year = document.querySelector('meta[name="year"]').content;
    const type = document.querySelector('meta[name="type"]').content;

    // Fetch slots and populate the table
    async function fetchSlots() {
        try {
            const response = await fetch(`/${year}/${type}/edit/slots`);

            if (!response.ok) {
                throw new Error(`Failed to fetch slots: ${response.statusText}`);
            }

            const slots = await response.json();
            populateSlotsTable(slots); // Populate table with slot data

        } catch (error) {
            console.error('Error fetching slots:', error);
            alert('An error occurred while fetching slots.');
        }
    }

    // Populate the slots table
    function populateSlotsTable(slots) {
        const tableElement = document.getElementById('slotsTable');
        if (tableElement) {
            const tableBody = tableElement.querySelector('tbody');
            if (tableBody) {
                tableBody.innerHTML = ''; // Clear existing rows
                slots.forEach(slot => {
                    const row = document.createElement('tr');
                    row.classList.add('slot');
                    row.setAttribute('data-id', slot._id);
                    row.innerHTML = `
                        <td>${slot.facultyName}</td>
                        <td>${slot.courseName}</td>
                        <td>${slot.division}</td>
                        <td><input type="date" value="${slot.date}" class="edit-date" data-id="${slot._id}"></td>
                        <td><input type="time" value="${slot.startTime}" class="edit-startTime" data-id="${slot._id}"></td>
                        <td><input type="time" value="${slot.endTime}" class="edit-endTime" data-id="${slot._id}"></td>
                        <td><input type="text" value="${slot.venue}" class="edit-venue" data-id="${slot._id}"></td>
                        <td><input type="text" value="${slot.desc}" class="edit-desc" data-id="${slot._id}"></td>
                        
                        <td><button class="btn delete-btn" data-id="${slot._id}">Delete</button></td> <!-- Delete button always visible -->
                        <td><button class="btn edit-btn" data-id="${slot._id}" style="display: none;">Edit</button></td> <!-- Hidden initially -->
                    `;
                    tableBody.appendChild(row);
                });

                // Add event listeners for input changes (date, time, venue, desc)
                tableBody.querySelectorAll('.edit-date, .edit-startTime, .edit-endTime, .edit-venue, .edit-desc').forEach(input => {
                    input.addEventListener('input', () => showEditButton(input));
                });

                // Add event listeners for the edit and delete buttons
                tableBody.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', () => handleEditButtonClick(button));
                });

                tableBody.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', () => handleDeleteButtonClick(button));
                });
            }
        }
    }

    // Show the edit button when any change is made
    function showEditButton(input) {
        const id = input.getAttribute('data-id');
        const row = document.querySelector(`tr.slot[data-id="${id}"]`);
        const editButton = row.querySelector('.edit-btn');

        // Show the edit button
        if (editButton) {
            editButton.style.display = 'inline-block';
        }
    }

    // Handle edit button click
    function handleEditButtonClick(button) {
        const id = button.getAttribute('data-id');
        const row = document.querySelector(`tr.slot[data-id="${id}"]`);

        const updatedSlot = {
            date: row.querySelector(`.edit-date[data-id="${id}"]`).value,
            startTime: row.querySelector(`.edit-startTime[data-id="${id}"]`).value,
            endTime: row.querySelector(`.edit-endTime[data-id="${id}"]`).value,
            venue: row.querySelector(`.edit-venue[data-id="${id}"]`).value,
            desc: row.querySelector(`.edit-desc[data-id="${id}"]`).value
        };

        fetch(`/${year}/${type}/edit/slot/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSlot)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                fetchSlots(); // Refresh the slots list after a successful edit
            } else {
                throw new Error('Error editing slot');
            }
        })
        .catch(error => {
            console.error('Error updating slot:', error);
            alert('An error occurred. Please try again.');
        });
    }

    // Handle delete button click
    function handleDeleteButtonClick(button) {
        const id = button.getAttribute('data-id');
        
        fetch(`/${year}/${type}/edit/slot/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                fetchSlots(); // Refresh the slots list after deletion
                // Remove the deleted slot from the DOM
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                    row.remove();
                }
            } else {
                throw new Error('Error deleting slot');
            }
        })
        .catch(error => {
            console.error('Error deleting slot:', error);
            alert('An error occurred. Please try again.');
        });
    }

    fetchSlots();
});



document.addEventListener('DOMContentLoaded', function() {
    const year = document.querySelector('meta[name="year"]').content;
    const type = document.querySelector('meta[name="type"]').content;

    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => formObject[key] = value);

            try {
                const response = await fetch(`/${year}/${type}/book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message); // Show success message
                } else {
                    alert(result.message); // Show error message
                }
            } catch (error) {
                console.error('Error booking slot:', error);
                alert('An error occurred. Please try again.'); // Error alert
            }
        });
    }
});

