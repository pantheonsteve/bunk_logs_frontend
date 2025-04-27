import axios from 'axios';

// Use consistent URL format - if your API returns 127.0.0.1, use that consistently
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Match exactly what's in your error message
  withCredentials: true, // THIS IS CRUCIAL - ensures cookies are sent with requests
  xsrfCookieName: 'csrftoken', // Django's default CSRF cookie name
  xsrfHeaderName: 'X-CSRFToken', // Django's expected CSRF header name
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;