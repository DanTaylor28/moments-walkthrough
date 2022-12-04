import axios from 'axios'

axios.defaults.baseURL = 'https://drf-api2.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true

// used to create the interceptors which will get attached to the child components
export const axiosReq = axios.create();
export const axiosRes = axios.create();