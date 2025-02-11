const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const dataPath = path.join(__dirname, 'data', 'data.json');

const loadData = () => {
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

const saveData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

app.post('/register', (req, res) => {
  const { name, requestedCourses } = req.body;

  const data = loadData(); 

  const student = { name, requestedCourses, schedule: [] };

  let recommendations = []; 

  for (let courseName of requestedCourses) {
    const course = data.courses.find(c => c.name === courseName);

    if (!course) {
      return res.status(400).send(`הקורס ${courseName} לא קיים.`);
    }

    if (course.enrolledStudents.length >= course.capacity) {
      return res.status(400).send(`הקורס ${courseName} מלא.`);
    }

    let conflictFound = false;
    for (let scheduledCourse of student.schedule) {
      const courseSchedule = course.schedule;
      console.log("scheduledCourse: ", scheduledCourse)
      console.log("courseSchedule: ", courseSchedule)
        if (courseSchedule && courseSchedule.some(
          (session) => session.day === scheduledCourse.day && session.time === scheduledCourse.time
        )) {
          conflictFound = true;
          console.log("conflict")
          break;
        }
      if (conflictFound) break;
    }

    if (conflictFound) {
        recommendations.push({ 
          conflict: `יש התנגשויות בשעות בקורס ${courseName}`, 
        });
    } else {
        student.schedule.push({ course: course.name, ...course.schedule[0] });
        course.enrolledStudents.push(student.name);
    }
  }

  data.students.push(student);
  saveData(data);

  res.status(201).send({ student, recommendations });
});

app.get('/courses', (req, res) => {
  const data = loadData();
  res.send(data.courses);
});

app.post('/courses', (req, res) => {
  const { name, capacity, schedule } = req.body;

  if (!name || !capacity || !schedule || !Array.isArray(schedule) || schedule.length === 0) {
    return res.status(400).send('חסרים פרטים על הקורס.');
  }

  const data = loadData();

  const newCourse = {
    name,
    capacity: parseInt(capacity),  
    schedule,
    enrolledStudents: []
  };

  data.courses.push(newCourse);
  saveData(data);

  res.status(201).send(newCourse);
});

app.listen(5000, () => console.log('Server running on port 5000'));
