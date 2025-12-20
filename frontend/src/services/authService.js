import axios from "axios";

const API = "/api";

// 회원가입
export async function signup(data) {
    return axios.post(`${API}/users/signup`, data, {
        withCredentials: true
    });
}

// 로그인
export async function login(data) {
    const response = await axios.post(`${API}/users/login`, data, {
        withCredentials: true
    });

    // 로그인 성공 시 표시만
    if (response.data) {
        localStorage.setItem('isLoggedIn', 'true');
    }

    return response;
}

// 로그아웃
export async function logout() {
    try {
        await axios.post(`${API}/users/logout`, {}, {
            withCredentials: true
        });

        // 로그인 여부 + 사용자 정보 모두 삭제
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginUser');

    } catch (error) {
        console.error('로그아웃 실패:', error);

        // 에러가 나도 localStorage는 지워야 함
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginUser');
        throw error;
    }
}

// 로그인 상태 확인
export function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// 로그인 세션 체크
export async function sessionCheck() {
  try {
    const res = await axios.get(`${API}/users/session-check`, {
      withCredentials: true,
    });
    return res.data; // 세션이 있으면 사용자 정보
  } catch (e) {
    return null; // 세션 없음
  }
}