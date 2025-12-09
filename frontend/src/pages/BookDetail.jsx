import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import { getBook } from "../services/bookService";
import { getLikeCount, toggleLike } from "../services/likeService";
import { toggleFavorite, getFavoriteCount, checkFavorited } from "../services/favoriteService";
import { getComments, createComment, deleteComment } from "../services/commentService";

export default function BookDetail() {
    const { id } = useParams();

    const [book, setBook] = useState(null);

    const [liked, setLiked] = useState(false);            // 좋아요 여부
    const [saved, setSaved] = useState(false);            // 찜 여부
    const [likeCount, setLikeCount] = useState(0);        // 좋아요 수
    const [favoriteCount, setFavoriteCount] = useState(0); // 찜 수

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    // -----------------------------------------------------
    // 🔥 초기 로딩 - 책 정보 / 댓글 / 좋아요 수 / 찜 수 / 찜 여부
    // -----------------------------------------------------
    useEffect(() => {
        getBook(id).then(setBook);

        getComments(id).then(setComments);

        getLikeCount(id).then(setLikeCount);

        getFavoriteCount(id).then(setFavoriteCount);

        // 찜 여부 확인
        checkFavorited(id)
            .then((res) => setSaved(res))
            .catch((err) => console.log("찜 여부 확인 오류:", err));
    }, [id]);

    if (!book) return <p>Loading...</p>;

    // -----------------------------------------------------
    // ❤️ 찜 토글
    // -----------------------------------------------------
    const handleToggleFavorite = async () => {
        await toggleFavorite(id);
        setSaved(!saved);
        getFavoriteCount(id).then(setFavoriteCount);
    };

    // -----------------------------------------------------
    // 👍 좋아요 토글
    // -----------------------------------------------------
    const handleToggleLike = async () => {
        await toggleLike(id);
        setLiked(!liked);
        getLikeCount(id).then(setLikeCount);
    };

    // -----------------------------------------------------
    // 📝 댓글 작성
    // -----------------------------------------------------
    const handleCreateComment = async () => {
        if (comment.trim() === "") return;

        await createComment(id, { content: comment });
        setComment("");

        getComments(id).then(setComments);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 2 }}>

            {/* --------------------------------------
                 상단: 이미지 + 상세 정보
            --------------------------------------- */}
            <Box sx={{ display: "flex", gap: 4 }}>

                {/* 이미지 */}
                <Box
                    sx={{
                        width: 400,
                        height: 600,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    {book.image ? (
                        <img
                            src={book.image.imageUrl}
                            alt={book.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                bgcolor: "#f0f0f0",
                                color: "#888",
                            }}
                        >
                            이미지 없음
                        </Box>
                    )}
                </Box>

                {/* 상세 정보 */}
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2, fontSize: "1.8rem", fontWeight: "bold" }}>
                        {book.title}
                    </Box>

                    {/* 정보 그리드 */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                        <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 1 }}>저자: {book.author}</Box>
                        <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 1 }}>장르: {book.genre}</Box>
                        <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 1 }}>언어: {book.language}</Box>
                        <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 1 }}>
                            전체 페이지: {book.pages || "-"}
                        </Box>
                    </Box>

                    {/* 줄거리 */}
                    <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2, minHeight: 200, whiteSpace: "pre-wrap" }}>
                        {book.content || "줄거리 정보가 없습니다."}
                    </Box>

                    {/* 좋아요 + 찜 */}
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>

                        {/* 좋아요 버튼 */}
                        <IconButton onClick={handleToggleLike} color="primary">
                            {liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                        </IconButton>
                        <Typography>좋아요: {likeCount}</Typography>

                        {/* 찜 버튼 */}
                        <IconButton onClick={handleToggleFavorite} color="error">
                            {saved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <Typography>찜: {favoriteCount}</Typography>
                    </Box>
                </Box>
            </Box>

            {/* --------------------------------------
                 댓글 입력 및 목록
            --------------------------------------- */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    댓글
                </Typography>

                {/* 댓글 입력 */}
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="댓글을 입력하세요..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleCreateComment}>
                        작성
                    </Button>
                </Box>

                {/* 댓글 리스트 */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {comments.map((c) => (
                        <Box key={c.id} sx={{ p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
                            <strong>{c.writerName}</strong>
                            <p>{c.content}</p>
                            <Button
                                size="small"
                                color="error"
                                onClick={() =>
                                    deleteComment(c.id).then(() =>
                                        getComments(id).then(setComments)
                                    )
                                }
                            >
                                삭제
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
