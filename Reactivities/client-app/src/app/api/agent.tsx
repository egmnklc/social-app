import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";


//* Add some delay to load content
const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(async (response) => {
  try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
});

const responseBody = <T extends any>(respose: AxiosResponse<T>) => respose.data;

const requests = {
  get: <T extends any>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T extends any>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T extends any>(url: string, body: {}) =>
    axios.put<T>(url, body).then(responseBody),
  del: <T extends any>(url: string) => axios.delete<T>(url).then(responseBody),
};
const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
};
const agent = {
  Activities,
};

export default agent;
