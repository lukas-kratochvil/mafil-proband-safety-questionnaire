import axios from "axios";
import { transformDateStringToDate } from "./axios-transformers";

/* SERVER instance */
const serverApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

serverApi.interceptors.response.use(transformDateStringToDate);

/* MAFILDB instance */
const mafildbApi = axios.create({
  baseURL: `${import.meta.env.VITE_MAFILDB_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

mafildbApi.interceptors.response.use(transformDateStringToDate);

/* Exported instances */
export default {
  serverApi,
  mafildbApi,
};
