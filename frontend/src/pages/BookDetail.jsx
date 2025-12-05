import { useParams } from "react-router-dom";

export default function BookDetail() {
    const { id } = useParams();

    return (
        <div>
            <h2>도서 상세 페이지</h2>
            <p>선택한 책 ID: {id}</p>
            <p>여기에 상세 정보가 표시됩니다.</p>
        </div>
    );
}
