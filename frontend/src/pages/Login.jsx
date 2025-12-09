import { Link } from 'react-router-dom';

export default function Login() {
    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">로그인</h1>
                <form className="login-form">
                    <label className="login-label">
                        이메일
                        <input type="email" className="login-input" placeholder="you@example.com" />
                    </label>
                    <label className="login-label">
                        비밀번호
                        <input type="password" className="login-input" placeholder="••••••••" />
                    </label>
                    <button type="submit" className="primary-btn full">로그인</button>

                    {/* 회원가입 링크 추가 */}
                    <p style={{
                        textAlign: 'center',
                        marginTop: '16px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        아직 회원이 아니라면? <Link to="/signup" style={{ color: '#4285f4', textDecoration: 'none', fontWeight: '500' }}>회원가입</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}