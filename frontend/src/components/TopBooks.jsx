import BookCard from "./BookCard";

const books = [
    {
        id: 1,
        title: "노인과 바다",
        author: "어니스트 헤밍웨이",
        image: "https://image.aladin.co.kr/product/818/0/cover500/8973584472_1.jpg",
        rank: "Top 1",
    },
    {
        id: 2,
        title: "무인도에서 살아남기",
        author: "Gomdori Co.",
        image: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788983927743.jpg",
        rank: "Top 2",
    },
    {
        id: 3,
        title: "해리포터와 비밀의 방",
        author: "J.K. 롤링",
        image:
            "https://th.bing.com/th/id/OIP.W_kfRArErSwkTd3AChq7IgAAAA?w=198&h=285&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1",
        rank: "Top 3",
    },
];

export default function TopBooks() {
    return (
        <section className="top-books">
            <div className="top-books-header">
                <div>
                    <h1 className="section-title">Top 10</h1>
                </div>
                <div className="sort-controls">
                    <button className="sort-link active">조회순</button>
                    <span className="divider">·</span>
                    <button className="sort-link">최신순</button>
                    <button className="view-link">자세히 보기</button>
                </div>
            </div>

            <div className="carousel">
                <button className="arrow-button" aria-label="이전">
                    {"<"}
                </button>
                <div className="card-track">
                    {books.map((book) => (
                        <BookCard key={book.id} {...book} />
                    ))}
                </div>
                <button className="arrow-button" aria-label="다음">
                    {">"}
                </button>
            </div>

            <div className="top-cta">
                <button className="primary-btn">등록</button>
            </div>
        </section>
    );
}
