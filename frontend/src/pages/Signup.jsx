import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 비밀번호 확인
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // Mock: 콘솔에 출력
        console.log('회원가입 데이터:', formData);
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
    };

    return (
        <div className="login-page">
            <div className="login-card" style={{ maxWidth: '450px' }}>
                <h1 className="login-title">회원가입</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-label">
                        이름
                        <input
                            type="text"
                            name="name"
                            className="login-input"
                            placeholder="홍길동"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="login-label">
                        아이디
                        <input
                            type="text"
                            name="id"
                            className="login-input"
                            placeholder="user123"
                            value={formData.id}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="login-label">
                        이메일
                        <input
                            type="email"
                            name="email"
                            className="login-input"
                            placeholder="you@example.com"
                            value={formData.email}
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

                    <label className="login-label">
                        비밀번호 확인
                        <input
                            type="password"
                            name="confirmPassword"
                            className="login-input"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <button type="submit" className="primary-btn full">
                        회원가입
                    </button>

                    <p style={{
                        textAlign: 'center',
                        marginTop: '16px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        이미 회원이신가요? <Link to="/login" style={{ color: '#4285f4', textDecoration: 'none', fontWeight: '500' }}>로그인</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}