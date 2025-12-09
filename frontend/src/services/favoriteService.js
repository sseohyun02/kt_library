import axios from "axios";
const API = "http://localhost:8080";

export function toggleFavorite(bookId) {
    return axios.post(
        `${API}/favorites/${bookId}`,
        {},
        { withCredentials: true }
    );
}

export function getFavoriteCount(bookId) {
    return axios.get(`${API}/favorites/${bookId}/count`)
        .then(res => res.data);
}
