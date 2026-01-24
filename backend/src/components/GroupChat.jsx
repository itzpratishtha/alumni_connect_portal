import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

export default function GroupChat({ groupId, userId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("joinGroupRoom", { groupId });

    socket.on("newGroupMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("newGroupMessage");
  }, [groupId]);

  const send = () => {
    const data = { groupId, senderId: userId, message };
    socket.emit("sendGroupMessage", data);
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <div>
      <h3>Group Chat</h3>
      {messages.map((m, i) => (
        <p key={i}><b>{m.senderId}:</b> {m.message}</p>
      ))}

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
