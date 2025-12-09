import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { mockBooks } from "../data/mockBooks";
// import { fetchBooks } from "../services/bookService"; // 나중에 실제 API 사용

export default function BookList() {
    // ✅ useState로 books 배열과 searchTerm 관리
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // ✅ useEffect로 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        // TODO: 나중에 실제 API 연동 시 주석 해제
        // const loadBooks = async () => {
        //     try {
        //         const data = await fetchBooks(searchTerm);
        //         setBooks(data);
        //     } catch (error) {
        //         console.error('책 목록 로드 실패:', error);
        //     }
        // };
        // loadBooks();

        // 현재는 Mock 데이터 사용
        const filteredBooks = mockBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setBooks(filteredBooks);

    }, [searchTerm]); // searchTerm 변경 시 재실행

    // 삭제 기능
    const handleDelete = (id) => {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
    };

    return (
        <Box sx={{ p: 3 }}>
            <h2>도서 목록</h2>

            {/* ✅ 검색창 추가 */}
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
                            <TableCell>제목</TableCell>
                            <TableCell>저자</TableCell>
                            <TableCell>삭제</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {books.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    검색 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            books.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.id}</TableCell>
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