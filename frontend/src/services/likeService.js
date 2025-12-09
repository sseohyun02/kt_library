import axios from "axios";
const API = "http://localhost:8080";

export function toggleLike(bookId) {
    return axios.post(
        `${API}/books/${bookId}/like`,
        {},
        { withCredentials: true }
    ).then(res => res.data);
}
