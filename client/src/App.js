import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [courses, setCourses] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', capacity: '', schedule: [] });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedCourses((prevSelectedCourses) =>
      checked
        ? [...prevSelectedCourses, value]
        : prevSelectedCourses.filter(course => course !== value)
    );
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        name: studentName,
        requestedCourses: selectedCourses
      });
      setSchedule(response.data.student.schedule);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response ? error.response.data : 'Unknown error');
    }
  };

  const handleAddCourse = async () => {
    try {
      const response = await axios.post('http://localhost:5000/courses', newCourse);
      setCourses(prevCourses => [...prevCourses, response.data]);
      setNewCourse({ name: '', capacity: '', schedule: [] });  
    } catch (error) {
      console.error('Add course error:', error);
      alert('Error adding course');
    }
  };

  const handleScheduleChange = (day, time) => {
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      schedule: [...prevCourse.schedule, { day, time }]
    }));
  };

  const handleRemoveSchedule = (day, time) => {
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      schedule: prevCourse.schedule.filter(schedule => !(schedule.day === day && schedule.time === time))
    }));
  };

  return (
    <div>
      <h1>מערכת רישום לקורסים</h1>
      <h2>הכנס קורס חדש למאגר</h2>
      <input
        type="text"
        placeholder="שם הקורס"
        value={newCourse.name}
        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="קיבולת"
        value={newCourse.capacity}
        onChange={(e) => setNewCourse({ ...newCourse, capacity: e.target.value })}
      />
      <h3>בחר ימים ושעות:</h3>
      <div>
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
          <div key={day}>
            <h4>{day}</h4>
            {['08:00', '10:00', '12:00', '14:00', '16:00'].map((time) => (
              <div key={`${day}-${time}`}>
                <input
                  type="checkbox"
                  onChange={() => handleScheduleChange(day, time)}
                />
                <label>{time}</label>
                <button onClick={() => handleRemoveSchedule(day, time)}>הסר</button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleAddCourse}>הוסף קורס</button>
      <div>
        <h2>הכנס שם סטודנט</h2>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="שם הסטודנט"
        />
      </div>

      <div>
        <h2>בחר קורסים</h2>
        {courses.map((course) => (
          <div key={course.name}>
            <input
              type="checkbox"
              id={course.name}
              value={course.name}
              onChange={handleCourseSelection}
            />
            <label htmlFor={course.name}>
              {course.name} (קיבולת: {course.capacity})
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleRegister}>רשום אותי</button>

      <div>
        <h2>לוח זמנים שלי:</h2>
        <ul>
          {schedule.map((entry, index) => (
            <li key={index}>
              {entry.course} - {entry.day} בשעה {entry.time}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>המלצות:</h2>
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec.conflict} - {rec.suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
