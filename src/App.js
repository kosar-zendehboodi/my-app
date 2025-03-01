import React, { useEffect, useState } from "react";
import axios from "axios";
import Scheduler from "./components/Scheduler";
import Toolbar from "./components/Toolbar";
import MessageArea from "./components/MessageArea";
import "./App.css";

const API_URL = "http://localhost:3001";

const App = () => {
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timeFormatState, setTimeFormatState] = useState(
    JSON.parse(localStorage.getItem("timeFormatState")) || false
  );

  useEffect(() => {
    axios
      .get(`${API_URL}/data`)
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));

    axios
      .get(`${API_URL}/messages`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  const addMessage = (messageText) => {
    const newMessage = { id: Date.now().toString(), text: messageText };

    axios
      .post(`${API_URL}/messages`, newMessage)
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, response.data]);
      })
      .catch((error) => console.error("Error adding message:", error));
  };

  const handleTimeFormatChange = (newFormat) => {
    setTimeFormatState(newFormat);
    localStorage.setItem("timeFormatState", JSON.stringify(newFormat));
  };
  const onDataUpdated = (action, item, id) => {
    const stringId = id.toString();
  
    if (action === "create") {
      // بررسی کن که این رویداد قبلاً وجود دارد یا نه
      const exists = events.some(event => event.id === stringId);
  
      if (!exists) {
        const newItem = { ...item, id: stringId };
  
        axios
          .post(`${API_URL}/data`, newItem)
          .then((response) => {
            setEvents((prevEvents) => [...prevEvents, response.data]);
            addMessage(`✅ Event "${item.text}" added.`);
          })
          .catch((error) => console.error("Error adding event:", error));
      }
    } 
    else if (action === "update") {
      axios
        .patch(`${API_URL}/data/${stringId}`, { text: item.text }) // فقط متن را تغییر بده
        .then(() => {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === stringId ? { ...event, text: item.text } : event
            )
          );
          addMessage(`✏️ Event "${item.text}" updated.`);
        })
        .catch((error) => console.error("Error updating event:", error));
    } 
    else if (action === "delete") {
      axios
        .delete(`${API_URL}/data/${stringId}`)
        .then(() => {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== stringId)
          );
          addMessage(`✖️ Event "${stringId}" deleted.`);
        })
        .catch((error) => console.error("❌ Error deleting event from DB:", error));
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
      <MessageArea messages={messages} />
    </div>
  );
};

export default App;
