import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function PublisherRegister() {
  const userId = localStorage.getItem("userId");
  const [message, setMessage] = useState("");

  async function sendRequest() {
    const res = await fetch(`${API_URL}/api/publisher-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div>
      <h2>Đăng ký Publisher</h2>
      <button onClick={sendRequest}>Gửi yêu cầu</button>
      <p>{message}</p>
    </div>
  );
}
