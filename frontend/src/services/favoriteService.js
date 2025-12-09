import axios from "axios";
const API = "http://localhost:8080";

// 찜 토글 (추가/해제)
export function toggleFavorite(bookId) {
    return axios.post(
        `${API}/favorites/${bookId}`,
        {},
        { withCredentials: true }
    );
}

// 찜 개수 조회
export function getFavoriteCount(bookId) {
    return axios.get(`${API}/favorites/${bookId}/count`, {
        withCredentials: true
    }).then(res => res.data);
}

// 내 찜 목록 조회
export async function getFavorites() {
    try {
        const response = await axios.get(`${API}/favorites`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("찜 목록 조회 실패:", error);
        throw error;
    }
}  // ← 여기서 닫아야 해!

// 내가 이 책을 찜했는지 확인
export async function checkFavorited(bookId) {
    try {
        const response = await axios.get(`${API}/favorites/${bookId}/check`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("찜 확인 실패:", error);
        return false;
    }
}