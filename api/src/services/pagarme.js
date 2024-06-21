import axios from "axios";
import { API_KEY } from "../constants.js";

const api = axios.create({
  baseURL: "https://api.pagar.me/1",
});

export default async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, {
      API_KEY,
      ...data,
    });

    return { error: false, data: response.data };
  } catch (err) {
    let message = "Unknown error";
    if (
      err.response &&
      err.response.data &&
      err.response.data.errors &&
      err.response.data.errors.length > 0
    ) {
      message = JSON.stringify(err.response.data.errors[0]);
    }

    return {
      error: true,
      message: message,
    };
  }
};
