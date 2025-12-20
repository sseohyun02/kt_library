import axios from "axios";
const API = "/api";

export function toggleLike(bookId) {
    return axios.post(
        `${API}/likes/${bookId}`,
        {},
        { withCredentials: true }
    ).then(res => res.data);
}
export function getLikeCount(bookId) {
    return axios.get(`${API}/likes/${bookId}/count`)
        .then(res => res.data);
}
// 추가: 로그인한 사용자가 이 책을 좋아요 눌렀는지 여부 조회
export function checkLiked(bookId) {
    return axios.get(
        `${API}/likes/${bookId}/status`,
        { withCredentials: true }
    ).then(res => res.data);  // true / false 반환
}