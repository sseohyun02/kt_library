import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { mockBooks } from "../data/mockBooks";
import { useState } from "react";

export default function BookList() {

    // ⭐ 변경점 1: mockBooks 를 상태로 변환하여 화면이 갱신되도록 함
    const [books, setBooks] = useState(mockBooks);

    // ⭐ 변경점 2: 삭제 기능 추가
    // 클릭된 책의 id를 받아서 books 배열에서 해당 항목 제거
    const handleDelete = (id) => {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks); // 상태 업데이트 → 화면 자동 갱신
    };

    return (
        <div>
            <h2>도서 목록</h2>

            <TableContainer component={Paper}>
                <Table>

                    {/* ⭐ 변경점 3: 테이블 헤더에 '삭제' 컬럼 추가 */}
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell>저자</TableCell>
                            <TableCell>삭제</TableCell> {/* ← 추가됨 */}
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {/* ⭐ 변경점 4: mockBooks → books 로 렌더링 데이터 변경 */}
                        {books.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell>{book.id}</TableCell>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>

                                {/* ⭐ 변경점 5: 삭제 버튼 추가 */}
                                <TableCell>
                                    <button onClick={() => handleDelete(book.id)}>
                                        삭제
                                    </button>
                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
