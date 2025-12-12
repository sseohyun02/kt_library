import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { getBooks } from "../services/bookService";
import { logout, isLoggedIn, sessionCheck } from "../services/authService"; // ← 추가!

export default function Layout({ children }) {
    const [query, setQuery] = useState("");
    const [loggedIn, setLoggedIn] = useState(false); // ← 추가!
    const navigate = useNavigate();

    // 로그인 상태 확인 (컴포넌트 로드 시)
    useEffect(() => {
        async function verifyLogin() {
            const session = await sessionCheck();

            if (session) {
                setLoggedIn(true);
            } else {
                // 세션이 없으면 강제 로그아웃 처리
                localStorage.removeItem("loginUser");
                setLoggedIn(false);
            }
        }

        verifyLogin();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        const keyword = query.trim();
        if (!keyword) return;

        const lower = keyword.toLowerCase();

        try {
            const books = await getBooks();

            const target = books.find(
                (b) =>
                    b.title.toLowerCase().includes(lower) ||
                    (b.author && b.author.toLowerCase().includes(lower))
            );

            if (target) {
                navigate(`/books/${target.id}`);
            } else {
                alert("검색 결과가 없습니다.");
            }
        } catch (err) {
            console.error("검색 중 오류 발생:", err);
            alert("검색 중 오류가 발생했습니다.");
        }
    };

    // 로그아웃 처리 (추가!)
    const handleLogout = async () => {
        try {
            await logout();
            setLoggedIn(false);
            alert("로그아웃 되었습니다.");
            navigate("/");
        } catch (error) {
            console.error("로그아웃 에러:", error);
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="layout">
            <header className="nav-bar">
                <div className="nav-left">
                    <Link to="/" className="brand-link">
                        <div className="brand">
                            <img src={logo} alt="로고" className="brand-logo" />
                        </div>
                    </Link>

                    <div className="nav-links">
                        <Link to="/mypage" className="nav-link active" style={{ textDecoration: 'none' }}>
                            내 서재
                        </Link>
                    </div>
                </div>

                <div className="nav-right">
                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="도서 검색"
                        />
                        <button type="submit" className="search-icon">&#128269;</button>
                    </form>

                    {/* 로그인/로그아웃 버튼 전환 */}
                    {loggedIn ? (
                        <button onClick={handleLogout} className="login-btn">
                            로그아웃
                        </button>
                    ) : (
                        <Link to="/login" className="login-btn">
                            로그인
                        </Link>
                    )}
                </div>
            </header>

            <main className="layout-body">{children}</main>
        </div>
    );
}