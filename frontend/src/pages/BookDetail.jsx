import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getBook } from "../services/bookService";

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        getBook(id).then(setBook).catch(console.error);
    }, [id]);

    if (!book) return <p>Loading...</p>;

    return (
        <Box sx={{ display: 'flex', p: 2 }}>

            {/* ---------------- 이미지 ---------------- */}
            <Box
                sx={{
                    width: '400px',
                    height: '600px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    mr: 4
                }}
            >
                {book.image ? (
                    <img
                        src={book.image.imageUrl}   // imageUrl 추가
                        alt={book.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: '#f0f0f0',
                            color: '#888'
                        }}
                    >
                        이미지 없음
                    </Box>
                )}
            </Box>

            {/* ---------------- 오른쪽 상세 ---------------- */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3, pl: 6, maxWidth: 800, ml: 10 }}>
                {/* 제목 */}
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        p: 2,
                        minHeight: 60,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        textAlign: 'left',
                    }}
                >
                    {book.title}
                </Box>

                {/* 정보 */}
                <Box
                    sx={{
                        alignSelf: 'flex-end',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                        maxWidth: 400,
                        mb: 3,
                    }}
                >
                    {[
                        { label: '저자', value: book.author },
                        { label: '장르', value: book.genre },
                        { label: '언어', value: book.language },
                        { label: '전체 페이지 수', value: book.pages },
                    ].map(({ label, value }) => (
                        <Box key={label} sx={{ border: '1px solid #ccc', borderRadius: 1, px: 2, py: 1, textAlign: 'right' }}>
                            {label}: {value || '-'}
                        </Box>
                    ))}
                </Box>

                {/* 내용 */}
                <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 3, minHeight: 200, whiteSpace: 'pre-wrap', overflowY: 'auto', textAlign: 'left' }}>
                    {book.content || '줄거리 정보가 없습니다.'}
                </Box>

                {/* 날짜 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignSelf: 'flex-end' }}>
                    {[
                        { label: '등록일', value: book.createDate },
                        { label: '최종 수정일', value: book.updateDate },
                    ].map(({ label, value }) => (
                        <Box key={label} sx={{ border: '1px solid #ccc', borderRadius: 1, px: 2, py: 1, minWidth: 150, textAlign: 'right' }}>
                            {label}: {value || '-'}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
