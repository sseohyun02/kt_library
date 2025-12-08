import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/bookService";

export default function MyPage() {
    // ⭐ 로그인한 사용자 정보 저장
    const [user, setUser] = useState(null);

    // ⭐ 내가 만든 책 목록
    const [myBooks, setMyBooks] = useState([]);

    // 페이지 로딩 시 실행
    useEffect(() => {
        // 1) 사용자 정보 불러오기
        const savedUser = localStorage.getItem("loginUser");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // 2) 책 목록 불러오기
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

    // ⭐ user 정보가 로딩되기 전에는 빈 화면 방지
    if (!user) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                로그인 정보 없음. 다시 로그인해주세요.
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8f9fa",
                padding: "40px 20px"
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    gap: "30px"
                }}
            >
                {/* 왼쪽: 회원 정보 */}
                <div
                    style={{
                        flex: "0 0 350px",
                        background: "#fff",
                        borderRadius: "12px",
                        padding: "30px",
                        height: "fit-content",
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
                        회원 정보
                    </h2>

                    <div
                        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                    >
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span
                                style={{
                                    fontWeight: "600",
                                    color: "#495057",
                                    width: "80px"
                                }}
                            >
                                이름:
                            </span>
                            <span style={{ color: "#212529" }}>{user.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span
                                style={{
                                    fontWeight: "600",
                                    color: "#495057",
                                    width: "80px"
                                }}
                            >
                                아이디:
                            </span>
                            <span style={{ color: "#212529" }}>{user.userId}</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <span
                                style={{
                                    fontWeight: "600",
                                    color: "#495057",
                                    width: "80px"
                                }}
                            >
                                이메일:
                            </span>
                            <span style={{ color: "#212529" }}>{user.email}</span>
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
