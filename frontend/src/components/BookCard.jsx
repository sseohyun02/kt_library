import { Link } from "react-router-dom";

/**
 * 단일 도서 카드
 * - 이미지가 없으면 placeholder 표시
 * - id가 없으면 링크 비활성화(placeholder 카드)
 */
export default function BookCard({ id, title, author, image, rank }) {
    const hasImage = Boolean(image);
    const clickable = id !== null && id !== undefined;

    const card = (
        <div className="book-card">
            {rank && <div className="book-rank">{rank}</div>}

            <div className="book-cover-wrap">
                {hasImage ? (
                    <img src={image} alt={title} className="book-cover" loading="lazy" />
                ) : (
                    <div className="book-cover placeholder">이미지 없음</div>
                )}
            </div>

            <div className="book-meta">
                <p className="book-title">{title}</p>
                <p className="book-author">{author}</p>
            </div>
        </div>
    );

    if (!clickable) {
        return <div className="book-card-link disabled">{card}</div>;
    }

    return (
        // <Link to={`/books/${id}`} className="book-card-link">
        //     {card}
        // </Link>
        <Link to="/books/detail"
            state={{ title, author, image }} // 여기서 state 전달
            // style={{ textDecoration: "none", color: "inherit" }} // 링크 스타일 제거
        >
            {card}
            {/*<div className="book-card-link" style={{ cursor: "pointer" }}>*/}
            {/*</div>*/}
        </Link>
    );
}
