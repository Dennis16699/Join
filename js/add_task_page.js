// Add Task page functionality

/**
 * This function starts the functions to load all the necessary data
 */

async function initAddTask() {
    loadAddTaskForm();
    await loadUserData();
    loadFromLocalStorage();
    loadFromLocalStorageContacts();
    loadStringFromLocalStorage();
    disablePastDates();

}


// Load Add Task Form Element

function loadAddTaskForm() {
    let AddTaskForm = document.getElementById('task-input-con');
    AddTaskForm.innerHTML = "";
    AddTaskForm.innerHTML = createAddTask();
}

//  Assigned To Field - render Contacts list 

/**
 * This function handles the appearance of the assigned to Button
 */

function showAssignedToBt() {
    document.getElementById('task-contacts-list-to-assign').classList.remove('d-none');
    document.getElementById('add-new-contact-bt').classList.remove('d-none');
    let contactsListToAssignCon = document.getElementById('task-contacts-list-to-assign');

    if (!contacts) {
        contactsListToAssignCon.innerHTML = "";
        contactsListToAssignCon.innerHTML = /*html*/`<p>&emsp; No contacts yet</p>`;
    } else {
        sortContactsList();
        renderAssignedToBt();
    }
}

/**
 * This function generates the html code for the assigned to Button with all the saved contacts.
 */

function renderAssignedToBt() {
    let contactsListToAssignCon = document.getElementById('task-contacts-list-to-assign');
    contactsListToAssignCon.innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        contactsListToAssignCon.innerHTML += createAssignedToBt(i, contact);
    }
}

function disablePastDates() {
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('task-date').min = today;
}

/**
 * This function closes the container with all the contacts listed.
 */

function closeAssignedToField() {
    let listOfContactsToAssigne = document.getElementById('task-contacts-list-to-assign');
    if (listOfContactsToAssigne) {
        listOfContactsToAssigne.classList.add('d-none');
        document.getElementById('add-new-contact-bt').classList.add('d-none');

        // showAssignedToIcons();
    }
}

/**
 * This function stops closeAssignedToField() from closing when clicked on that particular element.
 * 
 * @param {*} event 
 */

function stopClosing(event) {
    event.stopPropagation();
}

// subtask input field

/**
 * This function opens the subtext input by clicking on the subtask Button.
 */

function changeToSubText() {
    let subtaskButtonOpen = document.getElementById('task-sub-bt-open');
    subtaskButtonOpen.classList.add('d-none');
    let subtaskInputText = document.getElementById('task-sub-input-text-con');
    subtaskInputText.classList.remove('d-none');
}

/**
 * This function deletes the input value.
 */

function deleteInputText() {
    document.getElementById('task-sub-input-text').value = "";
}

/**
 * This function saves the input value as an object in newSubtask and than within the array subtasks.
 */

function saveInputText() {
    let subtaskInput = document.getElementById('task-sub-input-text');

    let newSubtask = {
        'text': subtaskInput.value,
        'completed': 0
    }
    subtasks.push(newSubtask);
    subtaskInput.value = "";

    renderInputText();
}

/**
 * The new subtask within the subtasks array is generated under the subtask Button
 */

function renderInputText() {
    let subtaskTextCon = document.getElementById('task-sub-text');
    subtaskTextCon.innerHTML = "";

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];

        subtaskTextCon.innerHTML += createInputText(i, subtask);
    }
}

/**
 * This function delets the subtask form the subtasks array and starts the
 * renderInputText() function again.
 * 
 * @param {number} i This is the index of the subtask
 */

function deleteSubtask(i) {
    subtasks.splice(i, 1);

    renderInputText();
}

/**
 * This fuction opens a new input field with the value of the choosen subtask to be changed.
 * 
 * @param {number} i This is the index of the subtask
 */

function editSubtask(i) {
    document.getElementById(`subtask-field-${i}`).classList.remove('d-none');
    document.getElementById(`subtask-li-${i}`).classList.add('d-none');
    let subtaskInputField = document.getElementById(`subtask-input-field-${i}`);
    subtaskInputField.value = subtasks[i]['text'];
}

/**
 * This function saves the changed input value and renders the subtasks again.
 * 
 * @param {number} i This is the index of the subtask
 */

function saveEditedSubtask(i) {
    let subtaskInputField = document.getElementById(`subtask-input-field-${i}`);
    subtasks[i]['text'] = subtaskInputField.value;

    document.getElementById(`subtask-field-${i}`).classList.add('d-none');
    document.getElementById(`subtask-li-${i}`).classList.remove('d-none');

    renderInputText();
}


/**
 * This function gets the tasks index 
 * 
 * @param {number} id This variable is the assigned id of the task
 * @returns The index of the task within the list array
 */

function getIndexTaskEdit(id) {
    for (let i = 0; i < list.length; i++) {
        const task = list[i];
        if (id == task['id']) {
            return i;
        }
    };
}

/**
* This function saves the subtasks in the global array subtasks
* 
* @param {object} task 
*/

function saveSubtasksListEdit(task) {
    subtasks = [];
    let taskSubtasks = task['subtasks'];
    for (let j = 0; j < taskSubtasks.length; j++) {
        const subtask = taskSubtasks[j];
        subtasks.push(subtask);
    }
}

/**
* 
* @param {number} id This variable is the assigned id of the task
* @param {number} i This variable is the task index in the list array
*/

async function changeTask(id, i) {
    let taskTitle = document.getElementById('task-title');
    let taskDescription = document.getElementById('task-description');
    let assignedTo = getAssignedToUsersEditTask(i);
    let dueDate = document.getElementById('task-date');
    let taskCategory = getTaskCategory();
    let taskBoard = list[i]['task_board'];

    await saveChangedTask(id, i, taskTitle.value, taskDescription.value, assignedTo, dueDate.value, taskCategory, taskBoard);
    closeBoardCard();
    showPopup('Task changed');
    loadTaskBoard();
}

/**
* This function saves the values within the variable changedTask and replaces the old task
* with the new inside the list array. Than everything is saved in localStorage and on the server agian.
* 
* @param {number} id This variable is the assigned id of the task
* @param {number} i This variable is the task index in the list array
* @param {string} taskTitle This variable is the task title
* @param {string} taskDescription This variable is the task text
* @param {object} assignedTo This variable is the task assigned users in an object
* @param {string} dueDate This variable is the due date
* @param {object} taskCategory This varibale is the category the task is assigned to
* @param {string} taskBoard This varibale is the category for the board fields
*/

async function saveChangedTask(id, i, taskTitle, taskDescription, assignedTo, dueDate, taskCategory, taskBoard) {
    let changedTask = {
        'id': id,
        'headline': taskTitle,
        'text': taskDescription,
        'task_user': assignedTo,
        'date': dueDate,
        'priority': taskPrio,
        'category': taskCategory,
        'subtasks': subtasks,
        'task_board': taskBoard,
    }

    list.splice(i, 1, changedTask);
    await SaveInLocalStorageAndServer(user, listString, list);
}

/**
* This function gets the assigned to users by either the checkbox input or
* if it wasn't changed, by the saved values inside the task object.
* 
* @param {number} i This variable is the task index in the list array
* @returns A object with the assigned to users
*/

function getAssignedToUsersEditTask(i) {
    let assignedToUser = getAssignedToUsers();
    let assignedTo = [];
    if (assignedToUser.length === 0) {
        let taskUsers = list[i]['task_user']
        for (let j = 0; j < taskUsers.length; j++) {
            const sglContacts = taskUsers[j];
            assignedTo.push(sglContacts);
        }
        return assignedTo;
    } else {
        return assignedToUser;
    }
}