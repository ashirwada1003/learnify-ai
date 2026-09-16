// This file is like a "personal assistant" for talking to our backend.
// Instead of every part of the app manually writing the full backend URL
// and manually attaching the login token every time, this file does both
// automatically, in ONE place — so the rest of our code can stay short.

import axios from "axios";

// Create a reusable connection to our backend.
// baseURL means: anywhere we write API.get("/courses"), it actually calls
// http://localhost:5000/api/courses — we never have to type the full address again.
const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// This runs automatically BEFORE every single request sent through API.
// Its job: check if we have a saved login token, and if so, attach it
// to the request — this is what makes protectMiddleware on the backend
// recognize us as "logged in" without us doing anything extra each time.
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;