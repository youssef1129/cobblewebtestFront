import axios from "axios";

export const axiosUri = axios.create({ baseURL: "http://localhost:6700/api" });
