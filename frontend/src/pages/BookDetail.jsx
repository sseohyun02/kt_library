import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { getBook } from "../services/bookService";

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getBook(id).then(setBook).catch(console.error);
    }, [id]);

    if (!book) return <p>Loading...</p>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 2 }}>

            {/* 상단: 이미지 + 상세정보 */}
            <Box sx={{ display: 'flex', gap: 4 }}>
                {/* 이미지 */}
                <Box
                    sx={{
                        width: 400,
                        height: 600,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    {book.image ? (
                        <img
                            src={book.image.imageUrl}
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
                                color: '#888',
                            }}
                        >
                            이미지 없음
                        </Box>
                    )}
                </Box>

                {/* 상세정보 */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, fontSize: '1.8rem', fontWeight: 'bold' }}>
                        {book.title}
                    </Box>

                    {/* 정보 그리드 */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        {[
                            { label: '저자', value: book.author },
                            { label: '장르', value: book.genre },
                            { label: '언어', value: book.language },
                            { label: '전체 페이지 수', value: book.pages },
                        ].map(({ label, value }) => (
                            <Box key={label} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, textAlign: 'right' }}>
                                {label}: {value || '-'}
                            </Box>
                        ))}
                    </Box>

                    {/* 내용 */}
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, minHeight: 200, whiteSpace: 'pre-wrap' }}>
                        {book.content || '줄거리 정보가 없습니다.'}
                    </Box>

                    {/* 등록/수정일 */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {[
                            { label: '등록일', value: book.createDate },
                            { label: '최종 수정일', value: book.updateDate },
                        ].map(({ label, value }) => (
                            <Box key={label} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, minWidth: 150, textAlign: 'right' }}>
                                {label}: {value || '-'}
                            </Box>
                        ))}
                    </Box>

                    {/* 좋아요 + 찜 버튼 */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <IconButton onClick={() => setLiked(!liked)} color="primary">
                            {liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                        </IconButton>
                        <IconButton onClick={() => setSaved(!saved)} color="error">
                            {saved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* 댓글 입력창 */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    댓글
                </Typography>

                {/* 입력창 + 버튼 */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="댓글을 입력하세요..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (comment.trim() === "") return;
                            setComments([...comments, comment]);
                            setComment("");
                        }}
                    >
                        작성
                    </Button>
                </Box>

                {/* 댓글 목록 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {comments.map((c, idx) => (
                        <Box key={idx} sx={{ p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                            {c}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
