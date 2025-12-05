import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
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
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="도서 검색"
                            aria-label="도서 검색"
                        />
                        <span className="search-icon" aria-hidden="true">
                            &#128269;
                        </span>
                    </div>
                    <Link to="/login" className="login-btn">
                        로그인
                    </Link>
                </div>
            </header>

            <main className="layout-body">{children}</main>
        </div>
    );
}
