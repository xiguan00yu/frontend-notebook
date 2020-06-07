import { create } from "apisauce";

const API_BASE_URL = "http://localhost:3100";

export const api = create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});
