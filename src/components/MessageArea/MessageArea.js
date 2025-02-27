const MessageArea = ({ messages }) => {
  const formattedMessages = messages.map((message, index) => (
    <li key={index}>{message}</li>
  ));

  return (
    <div className="message-area">
      <h3>Messages:</h3>
      <ul>{formattedMessages}</ul>
    </div>
  );
};
export default MessageArea;