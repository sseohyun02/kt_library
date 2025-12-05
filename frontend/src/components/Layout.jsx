import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { mockBooks } from "../data/mockBooks";

/**
 * 공통 레이아웃
 * - 상단 네비게이션(로고/탭/검색/로그인)
 * - 검색: 제목/저자 부분 일치 시 첫 도서 상세로 이동
 */
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
                        <button className="nav-link active">내 서재</button>
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
