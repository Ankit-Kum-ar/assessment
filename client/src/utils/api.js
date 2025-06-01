import axios from 'axios';

const api = axios.create({
  baseURL: 'https://assessment-c3hi.onrender.com',
  withCredentials: true, // Important: This allows cookies to be sent and received
  // headers: {
  //   'Content-Type': 'application/json'
  // },
  // // Add a longer timeout to prevent premature failures
  // timeout: 15000 
});

export default api;
