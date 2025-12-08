import axios from 'axios';
// npm install axios

const API_BASE_URL =  'http://localhost:8080/books'; //추후 api링크 연결

//전체 책 목록
export const fetchBooks = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error('책 목록 가져오기 실패: ', error);
        throw error;
    }
}

//한가지 책만 골라서 정보 가져오기
export const fetchBookById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('책 상세 정보 가져오기 실패:', error);
        throw error;
    }
};

export const createBook = async (bookData) => {
    try {
        const response = await axios.post(API_BASE_URL, bookData);
        return response.data;
    } catch (error) {
        console.error('책 등록 실패:', error);
        throw error;
    }

}

//책 정보 수정
export const updateBook = async (id, bookData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, bookData);
        return response.data;
    } catch (error) {
        console.error('책 수정 실패:', error);
        throw error;
    }
};

//책 정보 삭제
export const deleteBook = async (id) =>{
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('책 삭제 실패:', error);
        throw error;
    }

}