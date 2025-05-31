import axios from "axios";

const API_URL = "https://localhost:7298/api/Chat";

export async function sendMessage(token, sessionId, message, lat = 0, lng = 0) {
  const res = await axios.post(
    `${API_URL}/message`,
    { sessionId, message, lat, lng },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}
