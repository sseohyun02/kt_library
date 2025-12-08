import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        loginId: "",
        password: "",
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
            loginId: formData.loginId,   // 이메일 ❌ → loginId 사용
            password: formData.password
        };

        try {
            const result = await login(dto);
            console.log("로그인 성공:", result.data);

            alert("로그인 성공!");
            navigate("/"); // 필요하면 마이페이지로 변경
        } catch (err) {
            console.error("로그인 실패:", err);
            alert(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
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

                    <p style={{
                        textAlign: "center",
                        marginTop: "16px",
                        fontSize: "14px",
                        color: "#666"
                    }}>
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
