import { useState } from "react";
import { login } from "../services/auth";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("username", res.username);

      onLogin({
        token: res.token,
        userId: res.userId,
        username: res.username,
      });
    } catch (err) {
      alert("Đăng nhập thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        Đăng nhập
      </button>
    </form>
  );
}
