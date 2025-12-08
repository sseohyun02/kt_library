import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { getBooks } from "../services/bookService";

export default function Layout({ children }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        const keyword = query.trim();
        if (!keyword) return;

        const lower = keyword.toLowerCase();

        try {
            const books = await getBooks(); // 🔥 API에서 전체 도서 목록 불러오기

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
                        />
                        <button type="submit" className="search-icon">&#128269;</button>
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
