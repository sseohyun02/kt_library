import { Link } from "react-router-dom";

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
        // 수정됨: /books/detail → /books/${id}
        <Link to={`/books/${id}`} className="book-card-link">
            {card}
        </Link>
    );
}
