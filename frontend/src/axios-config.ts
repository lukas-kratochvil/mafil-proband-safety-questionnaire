import axios from "axios";
import { transformDateStringToDate } from "./axios-transformers";

/* SERVER instance */
const serverApi = axios.create({
  baseURL: import.meta.env.PROD ? "graphql" : `${import.meta.env.VITE_SERVER_URL}/graphql`,
  headers: {
    "Content-Type": "application/json",
    "SERVER-API-KEY": import.meta.env.VITE_SERVER_API_KEY,
  },
});

serverApi.interceptors.response.use(transformDateStringToDate);

/* MAFILDB instance */
const mafildbApi = axios.create({
  baseURL: `${import.meta.env.VITE_MAFILDB_API_URL}/api`,
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
