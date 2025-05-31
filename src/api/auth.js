import axios from "axios";
import config from "../config";

export async function login(email, password) {
  const res = await axios.post(`${config.apiUrl}/api/Auth/login`, {
    email,
    password,
  });
  return res.data;
}

export async function register(email, password) {
  const res = await axios.post(`${config.apiUrl}/api/Auth/register`, {
    email,
    password,
  });
  return res.data;
}
