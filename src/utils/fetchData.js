import axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export const axiosClients = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const getDataAPI = async (url, token) => {
  const res = await axiosClients.get(`${baseURL}/api/${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return res;
};

export const postDataAPI = async (url, post, token) => {
  const res = await axiosClients.post(`${baseURL}/api/${url}`, post, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return res;
};

export const putDataAPI = async (url, post, token) => {
  const res = await axiosClients.put(`${baseURL}/api/${url}`, post, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return res;
};

export const patchDataAPI = async (url, post, token) => {
  const res = await axiosClients.patch(`${baseURL}/api/${url}`, post, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await axiosClients.delete(`${baseURL}/api/${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return res;
};
