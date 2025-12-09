import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { getBooks, deleteBook } from "../services/bookService";

export default function BookList() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // API에서 목록 불러오기
    const loadBooks = async () => {
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (e) {
            console.error("책 목록 로드 실패:", e);
        }
    };

    // 첫 로딩 시 전체 목록 가져오기
    useEffect(() => {
        loadBooks();
    }, []);

    // 검색어 적용된 결과 필터링
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 삭제 기능 (API + UI 반영)
    const handleDelete = async (id) => {
        try {
            await deleteBook(id);
            setBooks((prev) => prev.filter((book) => book.id !== id));
        } catch (e) {
            console.error("삭제 실패:", e);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <h2>도서 목록</h2>

            {/* 검색창 */}
            <TextField
                fullWidth
                label="도서 검색 (제목 또는 저자)"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>표지</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell>저자</TableCell>
                            <TableCell>삭제</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    검색 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.id}</TableCell>

                                    <TableCell>
                                        {book.coverImageUrl ? (
                                            <img
                                                src={book.coverImageUrl}
                                                alt={`${book.title} 표지`}
                                                style={{ width: 50, height: 75, objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box sx={{ width: 50, height: 75, bgcolor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                                No Img
                                            </Box>
                                        )}
                                    </TableCell>

                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>

                                    <TableCell>
                                        <button onClick={() => handleDelete(book.id)}>
                                            삭제
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
