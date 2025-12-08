import axios from "axios";

const API_BASE = "http://localhost:8080";

export const getBook = (id) =>
    axios.get(`${API_BASE}/books/${id}`).then(res => res.data);

export const getBooks = () =>
    axios.get(`${API_BASE}/books`).then(res => res.data);

export const createBook = (data) =>
    axios.post(`${API_BASE}/books`, data).then(res => res.data);

export const updateBook = (id, data) =>
    axios.put(`${API_BASE}/books/${id}`, data).then(res => res.data);

export const deleteBook = (id) =>
    axios.delete(`${API_BASE}/books/${id}`);
