import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Scheduler from './components/Scheduler';
import Toolbar from './components/Toolbar';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [timeFormatState, setTimeFormatState] = useState(
    JSON.parse(localStorage.getItem('timeFormatState')) || false
  );
  
  const handleTimeFormatChange = (newFormat) => {
    setTimeFormatState(newFormat);
    localStorage.setItem("timeFormatState", JSON.stringify(newFormat));
  };
  
  useEffect(() => {
    axios.get('http://localhost:3001/data')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const onDataUpdated = (action, item, id) => {
    if (action === "create") {
      axios.post('http://localhost:3001/data', { ...item, id: id.toString() })
        .then(response => setEvents(prevEvents => [...prevEvents, response.data]))
        .catch(error => console.error('Error adding event:', error));
    } else if (action === "update") {
      axios.put(`http://localhost:3001/data/${id}`, item)
        .then(() => {
          setEvents(prevEvents =>
            prevEvents.map(event => event.id === id ? item : event)
          );
        })
        .catch(error => console.error('Error updating event:', error));
    } else if (action === "delete") {
      axios.delete(`http://localhost:3001/data/${id}`)
        .then(() => {
          setEvents(prevEvents =>
            prevEvents.filter(event => event.id !== id)
          );
        })
        .catch(error => console.error('Error deleting event:', error));
    }
  };



  return (
    <div>
      <div className="tool-bar">
        <Toolbar
          timeFormatState={timeFormatState}
          onTimeFormatStateChange={handleTimeFormatChange}
        />
      </div>
      <div className="scheduler-container">
        <Scheduler
          events={events}
          timeFormatState={timeFormatState}
          onDataUpdated={onDataUpdated}
        />
      </div>
    </div>
  );
};

export default App;
