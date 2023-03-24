import axios from "axios";

const serverApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const mafildbApi = axios.create({
  baseURL: `${import.meta.env.VITE_MAFILDB_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  serverApi,
  mafildbApi,
};
