import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

export default function Chat({ senderId, receiverId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", { senderId, receiverId });

    socket.on("newMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("newMessage");
  }, [senderId, receiverId]);

  const send = () => {
    const data = { senderId, receiverId, message };
    socket.emit("sendMessage", data);
    setMessages((prev) => [...prev, data]); // show immediately
    setMessage("");
  };

  return (
    <div>
      {messages.map((m, i) => (
        <p key={i}><b>{m.senderId}:</b> {m.message}</p>
      ))}
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
