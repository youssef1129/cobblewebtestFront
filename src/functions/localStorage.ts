import { Iuser } from "../interfaces/Iclient";

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setClient = (client: Iuser) => {
  localStorage.setItem("client", JSON.stringify(client));
};

export const getClient = () => {
  return JSON.parse(localStorage.getItem("client") || "");
};
