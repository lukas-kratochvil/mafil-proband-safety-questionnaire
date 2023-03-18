import axios from "axios";

const serverApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: connect to the MAFILDB API
// const mafilDbApi = axios.create({
//   baseURL: "",
// });

export default {
  serverApi,
  // mafilDbApi,
};
