# Task Management API Documentation

This documentation provides detailed information about the Task Management API. The API supports CRUD operations and allows filtering tasks based on various criteria.

## Endpoints

### 1. Create a Task

**Endpoint:**

```text
POST /tasks
```

**Description:**
Creates a new task in the database.

**Request Body:**

- `assignedTo` (string): Name of the person assigned to the task.
- `associatedAnimal` (string): Animal associated with the task.
- `description` (string): Task description.
- `dueDate` (string): Task due date (format: `MM/DD/YYYY`).
- `endDate` (string): Task end date (format: `MM/DD/YYYY`).
- `endTime` (string): Task end time (format: `HH:MM`).
- `id` (string): Unique task ID.
- `importance` (string): Importance level of the task.
- `isDone` (boolean): Task completion status (default: `false`).
- `repeat` (string): Task repeat frequency (e.g., Daily, Weekly).
- `startDate` (string): Task start date (format: `MM/DD/YYYY`).
- `startTime` (string): Task start time (format: `HH:MM`).
- `status` (string): Current task status (default: `To Do`).
- `title` (string): Task title.

**Response:**

- `201 Created`: Task created successfully.
- Example Response:

```json
{
    "message": "Task created successfully",
    "task_id": "<inserted_task_id>"
}
```

---

### 2. View All Tasks

**Endpoint:**

```text
GET /tasks
```

**Description:**
Retrieves all tasks from the database.

**Response:**

- `200 OK`: List of tasks.
- Example Response:

```json
[
    {
        "_id": "<task_id>",
        "assignedTo": "Nithya",
        "title": "Feed Cattle",
        ...
    }
]
```

---

### 3. View a Single Task

**Endpoint:**

```text
GET /tasks/<task_id>
```

**Description:**
Retrieves a specific task by its unique ID.

**Response:**

- `200 OK`: Task details.
- `404 Not Found`: Task not found.

**Example Response:**

```json
{
    "_id": "<task_id>",
    "assignedTo": "Nithya",
    "title": "Feed Cattle",
    ...
}
```

---

### 4. View Tasks Based on Filters

**Endpoint:**

```text
GET /tasks/filter
```

**Description:**
Retrieves tasks based on query parameters.

**Query Parameters:**

- `assignedTo` (string): Filter by assigned person.
- `status` (string): Filter by task status.
- `importance` (string): Filter by importance level.
- `associatedAnimal` (string): Filter by associated animal.

**Response:**

- `200 OK`: List of matching tasks.
- `404 Not Found`: No matching tasks found.

**Example URL:**

```text
GET /tasks/filter?assignedTo=Nithya&status=To%20Do
```

---

### 5. Edit a Task

**Endpoint:**

```text
PUT /tasks/<task_id>
```

**Description:**
Updates the details of a specific task.

**Request Body:**
Fields to be updated (same structure as `Create a Task`).

**Response:**

- `200 OK`: Task updated successfully.
- `404 Not Found`: Task not found.

**Example Response:**

```json
{
    "message": "Task updated successfully"
}
```

---

### 6. Delete a Task

**Endpoint:**

```text
DELETE /tasks/<task_id>
```

**Description:**
Deletes a specific task by its unique ID.

**Response:**

- `200 OK`: Task deleted successfully.
- `404 Not Found`: Task not found.

**Example Response:**

```json
{
    "message": "Task deleted successfully"
}
```
