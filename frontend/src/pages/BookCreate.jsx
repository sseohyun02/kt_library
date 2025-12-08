import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Box,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";

// 🔥 API 연동 함수 import (두 번째 코드에서 가져온 부분)
import { createBook, getBook, updateBook } from "../services/bookService";

export default function BookCreate() {

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // ------------------------------
    // 📌 폼 상태
    // ------------------------------
    const [formData, setFormData] = useState({
        title: "",
        language: "",
        genre: "",
        content: "",
        introduction: "",
        author: ""
    });

    const [coverImage, setCoverImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // ------------------------------
    // 📌 수정 모드일 때 서버에서 책 정보 불러오기
    // ------------------------------
    useEffect(() => {
        if (!isEditMode) return;

        const loadBook = async () => {
            try {
                const book = await getBook(id);

                setFormData({
                    title: book.title || "",
                    author: book.author || "",
                    language: book.language || "",
                    genre: book.genre || "",
                    introduction: book.introduction || "",
                    content: book.content || ""
                });

                setCoverImage(book.coverImage || null);

            } catch (err) {
                console.error(err);
                alert("책 정보를 불러오지 못했습니다.");
            }
        };

        loadBook();
    }, [isEditMode, id]);

    // ------------------------------
    // 📌 입력 변경 처리
    // ------------------------------
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ------------------------------
    // 📌 표지 생성 (Mock)
    // ------------------------------
    const handleGenerateCover = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setCoverImage(
                "https://via.placeholder.com/480x675/4A90E2/ffffff?text=AI+Generated+Cover"
            );
            setIsGenerating(false);
            alert("표지가 생성되었습니다!");
        }, 1500);
    };

    // ------------------------------
    // 📌 등록 / 수정 처리
    // ------------------------------
    const handleSubmit = async () => {
        if (!coverImage) {
            alert("표지를 먼저 생성해주세요!");
            return;
        }

        // API에 전송할 DTO
        const dto = {
            title: formData.title,
            author: formData.author,
            content: formData.content,
            introduction: formData.introduction,
            language: formData.language || "KO",
            genre: formData.genre || "NOVEL",
            coverImage: coverImage
        };

        try {
            if (isEditMode) {
                await updateBook(id, dto);
                alert("도서가 수정되었습니다!");
            } else {
                await createBook(dto);
                alert("도서가 등록되었습니다!");
            }

            navigate("/mypage");
        } catch (error) {
            console.error(error);
            alert("작업 중 오류가 발생했습니다.");
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f8f9fa',
            py: 6,
            px: 2
        }}>
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>

                {/* 페이지 제목 */}
                <Typography
                    variant="h4"
                    sx={{
                        mb: 5,
                        textAlign: 'center',
                        fontWeight: 700,
                        color: '#212529'
                    }}
                >
                    {isEditMode ? '도서 수정' : '도서 등록'}
                </Typography>

                <Box sx={{
                    display: 'flex',
                    gap: 5,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    mb: 5
                }}>

                    {/* 왼쪽: 표지 미리보기 */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3
                    }}>
                        <Paper
                            elevation={0}
                            sx={{
                                width: 480,
                                height: 675,
                                bgcolor: '#e9ecef',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundImage: coverImage ? `url(${coverImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 2,
                                border: '1px solid #dee2e6'
                            }}
                        >
                            {!coverImage && (
                                <Typography variant="h6" color="text.secondary">
                                    표지 미리보기
                                </Typography>
                            )}
                        </Paper>

                        <Button
                            variant="contained"
                            onClick={handleGenerateCover}
                            disabled={isGenerating || !formData.title || !formData.content}
                            sx={{
                                width: 220,
                                py: 1.5,
                                bgcolor: '#adb5bd',
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: 600,
                                borderRadius: 1.5,
                                boxShadow: 'none'
                            }}
                        >
                            {isGenerating ? '생성 중...' : '표지 생성'}
                        </Button>
                    </Box>

                    {/* 오른쪽: 입력 폼 */}
                    <Paper
                        elevation={0}
                        sx={{
                            width: 550,
                            p: 4,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            border: '1px solid #dee2e6'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>

                            {/* 제목 */}
