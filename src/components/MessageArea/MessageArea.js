import React from "react";

const MessageArea = ({ messages }) => {
  return (
    <div className="message-area">
      <h3>Messages:</h3>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessageArea;
