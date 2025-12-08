import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/bookService";

export default function MyPage() {
    const [user, setUser] = useState(null);   // ⭐ 로그인 유저 상태
    const [myBooks, setMyBooks] = useState([]);

    useEffect(() => {
        // ⭐ 로그인한 사용자 정보 불러오기
        const storedUser = localStorage.getItem("loginUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        loadMyBooks();
    }, []);

    const loadMyBooks = async () => {
        try {
            const data = await getBooks();
            setMyBooks(data);
        } catch (error) {
            console.error("❌ 책 목록 불러오기 실패:", error);
        }
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await deleteBook(bookId);
            alert("도서가 삭제되었습니다!");
            loadMyBooks();
        } catch (error) {
            console.error("❌ 책 삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // ⭐ 로그인 정보가 없으면 로딩 또는 안내 메시지
    if (!user) {
        return <div style={{ padding: "40px" }}>로그인이 필요합니다.</div>;
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "40px 20px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "30px" }}>

                {/* ⭐ 왼쪽: 로그인한 사용자 정보 표시 */}
                <div style={{
                    flex: "0 0 350px",
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "30px",
                    height: "fit-content",
                    border: "1px solid #dee2e6"
                }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>회원 정보</h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span style={{ fontWeight: "600", width: "80px" }}>이름:</span>
                            <span>{user.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span style={{ fontWeight: "600", width: "80px" }}>아이디:</span>
                            <span>{user.loginId}</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span style={{ fontWeight: "600", width: "80px" }}>이메일:</span>
                            <span>{user.email}</span>
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 내가 만든 책 */}
                <div
                    style={{
                        flex: 1,
                        background: "#fff",
                        borderRadius: "12px",
                        padding: "30px",
                        border: "1px solid #dee2e6"
                    }}
                >
                    <h2
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            marginBottom: "24px",
                            color: "#212529"
                        }}
                    >
                        내가 만든 책
                    </h2>

                    {myBooks.length === 0 ? (
                        <p
                            style={{
                                color: "#6c757d",
                                textAlign: "center",
                                padding: "40px"
                            }}
                        >
                            아직 등록한 책이 없습니다.
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {myBooks.map((book) => (
                                <div
                                    key={book.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px",
                                        background: "#f8f9fa",
                                        borderRadius: "8px",
                                        border: "1px solid #e9ecef"
                                    }}
                                >
                                    <div
                                        style={{ display: "flex", gap: "16px", alignItems: "center" }}
                                    >
                                        {/* 표지 */}
                                        <div
                                            style={{
                                                width: "60px",
                                                height: "80px",
                                                background: "#dee2e6",
                                                borderRadius: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "10px",
                                                color: "#6c757d"
                                            }}
                                        >
                                            No Image
                                        </div>

                                        <div>
                                            <h3
                                                style={{
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    marginBottom: "4px",
                                                    color: "#212529"
                                                }}
                                            >
                                                {book.title}
                                            </h3>
                                            <p style={{ fontSize: "14px", color: "#6c757d" }}>
                                                {book.author}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 수정/삭제 버튼 */}
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <Link
                                            to={`/books/edit/${book.id}`}
                                            style={{
                                                padding: "8px 20px",
                                                background: "#6c757d",
                                                color: "#fff",
                                                textDecoration: "none",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                fontWeight: "500"
                                            }}
                                        >
                                            수정
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            style={{
                                                padding: "8px 20px",
                                                background: "#dc3545",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                cursor: "pointer"
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
