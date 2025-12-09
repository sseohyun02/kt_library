import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import { mockBooks } from "../data/mockBooks";

export default function TopBooks() {
    const [sort, setSort] = useState("조회순"); // 표시용 정렬 상태 (UI용)
    const trackRef = useRef(null);
    const barRef = useRef(null);
    const dragState = useRef({ startX: 0, startScroll: 0 });
    const dragging = useRef(false);

    const [scrollPos, setScrollPos] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [barWidth, setBarWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const THUMB_WIDTH = 180;

    // 화살표 클릭 스크롤
    const scrollTrack = (delta) => {
        if (trackRef.current) {
            trackRef.current.scrollBy({ left: delta, behavior: "smooth" });
        }
    };

    // 스크롤/리사이즈 시 위치·길이 동기화
    const syncScroll = () => {
        if (!trackRef.current) return;
        setScrollPos(trackRef.current.scrollLeft);
        setMaxScroll(Math.max(trackRef.current.scrollWidth - trackRef.current.clientWidth, 0));
        if (barRef.current) setBarWidth(barRef.current.clientWidth);
    };

    // 바 클릭/슬라이더 이동
    const moveTo = (value) => {
        const v = Number(value);
        setScrollPos(v);
        if (trackRef.current) {
            trackRef.current.scrollTo({ left: v, behavior: "auto" });
        }
    };

    // 커스텀 바 드래그 시작
    const startDrag = (e) => {
        if (!barRef.current || maxScroll <= 0) return;
        dragging.current = true;
        setIsDragging(true);
        e.preventDefault();
        dragState.current = { startX: e.clientX, startScroll: scrollPos };
        window.addEventListener("mousemove", onDrag);
        window.addEventListener("mouseup", endDrag);
    };

    // 드래그 중 이동
    const onDrag = (e) => {
        if (!dragging.current || !barRef.current || maxScroll <= 0) return;
        e.preventDefault();
        const usable = Math.max(barWidth - THUMB_WIDTH, 0);
        if (usable === 0) return;
        const deltaX = e.clientX - dragState.current.startX;
        const next = dragState.current.startScroll + (deltaX / usable) * maxScroll;
        moveTo(Math.min(Math.max(next, 0), maxScroll));
    };

    // 드래그 종료
    const endDrag = () => {
        dragging.current = false;
        setIsDragging(false);
        window.removeEventListener("mousemove", onDrag);
        window.removeEventListener("mouseup", endDrag);
    };

    useEffect(() => {
        syncScroll();
        window.addEventListener("resize", syncScroll);
        return () => {
            window.removeEventListener("resize", syncScroll);
            window.removeEventListener("mousemove", onDrag);
            window.removeEventListener("mouseup", endDrag);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // mockBooks 기반 Top10, 부족분은 placeholder
    const paddedBooks = Array.from({ length: 10 }, (_, idx) => {
        const src = mockBooks[idx];
        return src
            ? { ...src, rank: `Top ${idx + 1}` }
            : { id: null, title: `새 책 ${idx + 1}`, author: "미정", image: "", rank: `Top ${idx + 1}` };
    });

    return (
        <section className="top-books">
            <div className="top-books-header">
                <div>
                    <h1 className="section-title">Top 10</h1>
                </div>
                <div className="sort-controls">
                    <button
                        className={`sort-link ${sort === "조회순" ? "active" : ""}`}
                        onClick={() => setSort("조회순")}
                    >
                        조회순
                    </button>
                    <span className="divider">·</span>
                    <button
                        className={`sort-link ${sort === "최신순" ? "active" : ""}`}
                        onClick={() => setSort("최신순")}
                    >
                        최신순
                    </button>
                    <Link to="/books" className="view-link">
                        자세히 보기
                    </Link>
                </div>
            </div>

            <div className="carousel">
                <button
                    className="arrow-button"
                    aria-label="이전"
                    onClick={() => scrollTrack(-260)}
                >
                    {"<"}
                </button>
                <div className="card-track" ref={trackRef} onScroll={syncScroll}>
                    {paddedBooks.map((book, idx) => (
                        <BookCard key={`${book.id ?? "placeholder"}-${idx}`} {...book} />
                    ))}
                </div>
                <button
                    className="arrow-button"
                    aria-label="다음"
                    onClick={() => scrollTrack(260)}
                >
                    {">"}
                </button>
            </div>

            <CustomScrollbar
                barRef={barRef}
                scrollPos={scrollPos}
                maxScroll={maxScroll}
                barWidth={barWidth}
                thumbWidth={THUMB_WIDTH}
                onBarClick={moveTo}
                onThumbMouseDown={startDrag}
                isDragging={isDragging}
            />

            <div className="top-cta">
                <Link to="/books/new" className="primary-btn">
                    등록
                </Link>
            </div>
        </section>
    );
}

function CustomScrollbar({
    barRef,
    scrollPos,
    maxScroll,
    barWidth,
    thumbWidth,
    onBarClick,
    onThumbMouseDown,
    isDragging,
}) {
    const usable = Math.max(barWidth - thumbWidth, 0);
    const ratio = maxScroll > 0 ? scrollPos / maxScroll : 0;
    const thumbLeft = Math.min(Math.max(ratio * usable, 0), usable);

    const handleClick = (e) => {
        if (!barRef.current || maxScroll <= 0 || barWidth === 0) return;
        const rect = barRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const clamped = Math.min(Math.max(x, 0), barWidth);
        const nextScroll = (clamped / barWidth) * maxScroll;
        onBarClick(nextScroll);
    };

    return (
        <div className="custom-scrollbar">
            <div className="custom-scrollbar-track" ref={barRef} onClick={handleClick}>
                <div
                    className={`custom-scrollbar-thumb ${isDragging ? "dragging" : ""}`}
                    style={{ width: `${thumbWidth}px`, left: `${thumbLeft}px` }}
                    onMouseDown={onThumbMouseDown}
                />
            </div>
        </div>
    );
}
