import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { mockBooks } from "../data/mockBooks";

export default function Layout({ children }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const keyword = query.trim();
        if (!keyword) return;
        const lower = keyword.toLowerCase();
        const target = mockBooks.find(
            (b) =>
                b.title.toLowerCase().includes(lower) ||
                b.author.toLowerCase().includes(lower),
        );
        if (target) {
            navigate(`/books/${target.id}`);
        } else {
            alert("검색 결과가 없습니다.");
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
                        {/* 내 서재 → 마이페이지로 연결 */}
                        <Link to="/mypage" className="nav-link active" style={{ textDecoration: 'none' }}>
                            내 서재
                        </Link>
                        <button className="nav-link">관리</button>
                        <button className="nav-link">관심</button>
                    </div>
                </div>

                <div className="nav-right">
                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="도서 검색"
                            aria-label="도서 검색"
                        />
                        <button type="submit" className="search-icon" aria-label="검색">
                            &#128269;
                        </button>
                    </form>
                    <Link to="/login" className="login-btn">
                        로그인
                    </Link>
                </div>
            </header>

            <main className="layout-body">{children}</main>
        </div>
    );
}