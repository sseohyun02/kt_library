import axios from "axios";
const API = "http://localhost:8080";

// 댓글 목록
export function getComments(bookId) {
    return axios.get(`${API}/comments/${bookId}`).then(res => res.data);
}

// 댓글 작성
export function createComment(bookId, data) {
    return axios.post(
        `${API}/comments/${bookId}`,
        data,
        { withCredentials: true }
    ).then(res => res.data);
}

// 댓글 삭제
export function deleteComment(commentId) {
    return axios.delete(`${API}/comments/${commentId}`);
}
