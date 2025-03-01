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

  // 📌 دریافت اطلاعات از دیتابیس هنگام اجرای برنامه
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
 
    if (action === "create") {
      axios
        .post("http://localhost:3001/data", { ...item, id: id.toString() })
        .then((response) => {
          setEvents((prevEvents) => [...prevEvents, response.data]);
          addMessage(`✅ Event "${item.text}" added.`);
        })
        .catch((error) => console.error("Error adding event:", error));
    } else if (action === "update") {
      axios
        .put(`http://localhost:3001/data/${id.toString()}`, item)
        .then(() => {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === id ? { ...event, ...item } : event
            )
          );
          addMessage(`✏️ Event "${item.text}" updated.`);
        })
        .catch((error) => console.error("Error updating event:", error));
    } else if (action === "delete") {
      axios.delete(`http://localhost:3001/data/${id.toString()}`)
        .then(() => {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== id)
          );
          addMessage(`✖️ Event "${id}" deleted.`);
        })
        .catch((error) =>
          console.error("❌ Error deleting event from DB:", error)
        );
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
