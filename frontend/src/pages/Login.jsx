import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
    const [formData, setFormData] = useState({
        loginId: "",  // ← 다시 loginId로
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dto = {
            loginId: formData.loginId,  // ← loginId
            password: formData.password
        };

        try {
            const res = await login(dto);
            localStorage.setItem("loginUser", JSON.stringify(res.data));
            alert("로그인 성공!");
            window.location.href = "/mypage";
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "로그인 실패");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">로그인</h1>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-label">
                        아이디
                        <input
                            type="text"
                            name="loginId"
                            className="login-input"
                            placeholder="아이디를 입력하세요"
                            value={formData.loginId}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="login-label">
                        비밀번호
                        <input
                            type="password"
                            name="password"
                            className="login-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <button type="submit" className="primary-btn full">
                        로그인
                    </button>

                    <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#666" }}>
                        아직 회원이 아니신가요?{" "}
                        <Link to="/signup" style={{ color: "#4285f4", textDecoration: "none", fontWeight: "500" }}>
                            회원가입
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}