import { useState } from 'react';
import { fetchBooks } from '../services/bookService';

export default function TestPage() {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const testAPI = async () => {
        try {
            const books = await fetchBooks();
            console.log('✅ 성공:', books);
            setResult(JSON.stringify(books, null, 2));
            setError(null);
        } catch (err) {
            console.error('❌ 실패:', err);
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h1>📡 API 테스트</h1>

            <button
                onClick={testAPI}
                style={{
                    padding: '15px 30px',
                    fontSize: '16px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                📚 책 목록 가져오기
            </button>

            {error && (
                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '8px'
                }}>
                    <h3>❌ 에러:</h3>
                    <pre>{error}</pre>
                </div>
            )}

            {result && (
                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '8px'
                }}>
                    <h3>✅ 결과:</h3>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
}