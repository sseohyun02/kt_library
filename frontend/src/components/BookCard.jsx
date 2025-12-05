export default function BookCard({ title, author, image, rank }) {
    return (
        <div className="book-card">
            {rank && <div className="book-rank">{rank}</div>}
            <div className="book-cover-wrap">
                <img src={image} alt={title} className="book-cover" />
            </div>
            <div className="book-meta">
                <p className="book-title">{title}</p>
                <p className="book-author">{author}</p>
            </div>
        </div>
    );
}
