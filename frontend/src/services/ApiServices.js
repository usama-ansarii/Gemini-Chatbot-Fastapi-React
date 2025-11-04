import axios from 'axios';
import { basePath } from "../constants";

export const apiServices = axios.create({
  baseURL: basePath,
  timeout: 35000,
  withCredentials: true,
});

// ===== Request interceptor =====
apiServices.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    config.headers = {
      Accept: 'application/json,text/plain,*/*',
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => Promise.reject(error)
);


// ===== Response interceptor =====
apiServices.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await axios.post(`${basePath}/auth/refresh`, { refresh_token: refreshToken });
        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
