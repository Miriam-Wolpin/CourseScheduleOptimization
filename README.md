# Course Schedule Optimization

This project provides a solution for optimizing course schedules for students who want to register for classes while avoiding conflicts, managing capacity, and offering alternatives if needed.

## Prerequisites

- Node.js (version 14 or higher)
- npm (or Yarn)

## Setup and Installation

please run at server directory: npm start
and also in client directory: npm start

API Endpoints
1. Create a Course
POST /courses

Description: Create a new course in the system.

Request Body:

name: The name of the course (string).
capacity: The maximum number of students (integer).
schedule: An array of objects containing day and time for the course sessions.
Example:
{
  "name": "Math 101",
  "capacity": 30,
  "schedule": [
    { "day": "Monday", "time": "10:00" },
    { "day": "Wednesday", "time": "10:00" }
  ]
}
2. Register a Student
POST /register

Description: Register a student for one or more courses.

Request Body:

name: The student's name (string).
requestedCourses: An array of course names that the student wants to register for.
Example:
{
  "name": "John Doe",
  "requestedCourses": ["Math 101", "Physics 101"]
}
3. Get All Courses
GET /courses
Description: Get a list of all courses in the system.
How the Algorithm Works
The algorithm ensures that students can register for courses with no scheduling conflicts and within available capacity. Here's how it works:

Course Capacity: The system checks if a course is full. If it is, the student cannot register for it.
Schedule Conflicts: The system checks if the requested courses overlap in timing. If there's a conflict, the system will suggest alternative courses.
Alternative Suggestions: If a course is full or there are conflicts, the algorithm will recommend other courses with available spots and different timings.
Running the Project Locally
Once you have the project set up locally, follow these steps to test the system:

Create Courses: Use the /courses endpoint to add new courses to the system.
Register Students: Use the /register endpoint to register students for the courses. The system will check for conflicts, full courses, and suggest alternatives.
View Courses: You can view all courses available using the /courses GET endpoint.
Contributing
This project is open to contributions! If you have suggestions for improvements or bug fixes, feel free to submit a pull request.

