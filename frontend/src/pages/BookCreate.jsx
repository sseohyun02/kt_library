import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

import { createBook, getBook, updateBook } from "../services/bookService";

export default function BookForm() {
    const { id } = useParams();              // /books/edit/:id 들어왔을 때만 존재
    const navigate = useNavigate();
    const isEditMode = !!id;                 // id가 있으면 수정 모드

    // ------------------------------
    // 📌 폼 상태
    // ------------------------------
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        language: "",
        genre: "",
        content: ""
    });

    // ------------------------------
    // 📌 표지 이미지 상태
    // ------------------------------
    const [coverImage, setCoverImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // ------------------------------
    // 📌 수정 모드일 때 기존 데이터 로드
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
                    content: book.content || ""
                });

                // 커버이미지는 백엔드가 없으니 일단 빈값 처리
                setCoverImage(book.coverImage || null);

            } catch (error) {
                console.error("❌ 책 불러오기 실패:", error);
                alert("책 정보를 불러오지 못했습니다.");
            }
        };

        loadBook();
    }, [id, isEditMode]);

    // ------------------------------
    // 입력값 변경 처리
    // ------------------------------
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ------------------------------
    // 표지 생성 (Mock)
    // ------------------------------
    const handleGenerateCover = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setCoverImage(
                "https://via.placeholder.com/300x400/4A90E2/ffffff?text=AI+Generated+Cover"
            );
            setIsGenerating(false);
            alert("표지가 생성되었습니다!");
        }, 1500);
    };

    // ------------------------------
    // 등록 / 수정 공통 처리
    // ------------------------------
    const handleSubmit = async () => {
        if (!coverImage) {
            alert("표지를 먼저 생성해주세요!");
            return;
        }

        const dto = {
            title: formData.title,
            author: formData.author,
            language: formData.language || "KO",
            genre: formData.genre || "NOVEL",
            content: formData.content
        };

        try {
            if (isEditMode) {
                // ✏ 수정 요청
                await updateBook(id, dto);
                alert("도서가 수정되었습니다!");
            } else {
                // ➕ 등록 요청
                await createBook(dto);
                alert("도서가 등록되었습니다!");
            }

            navigate("/books");  // 완료 후 목록으로 이동

        } catch (error) {
            console.error(error);
            alert("작업 중 오류가 발생했습니다.");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f8f9fa",
                py: 6,
                px: 2
            }}
        >
            <Box sx={{ maxWidth: 1100, mx: "auto" }}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 5,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#212529"
                    }}
                >
                    {isEditMode ? "도서 수정" : "도서 등록"}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 5,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        mb: 5
                    }}
                >
                    {/* 왼쪽 - 표지 미리보기 */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                width: 320,
                                height: 450,
                                bgcolor: "#e9ecef",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundImage: coverImage ? `url(${coverImage})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: 2,
                                border: "1px solid #dee2e6"
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
                                bgcolor: "#adb5bd",
                                color: "#fff",
                                fontSize: "15px",
                                fontWeight: 600,
                                borderRadius: 1.5
                            }}
                        >
                            {isGenerating ? "생성 중..." : "표지 생성"}
                        </Button>
                    </Box>

                    {/* 오른쪽 - 입력 폼 */}
                    <Paper
                        elevation={0}
                        sx={{
                            width: 550,
                            p: 4,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            border: "1px solid #dee2e6"
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>

                            {/* 제목 */}
                            <Box>
                                <Typography sx={{ mb: 1.5, fontWeight: 600 }}>1. 제목</Typography>
                                <TextField
                                    fullWidth
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>

                            {/* 저자 */}
                            <Box>
                                <Typography sx={{ mb: 1.5, fontWeight: 600 }}>2. 저자</Typography>
                                <TextField
                                    fullWidth
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>

                            {/* 언어 */}
                            <Box>
                                <Typography sx={{ mb: 1.5, fontWeight: 600 }}>3. 언어</Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>언어 선택</MenuItem>
                                        <MenuItem value="KO">한국어</MenuItem>
                                        <MenuItem value="EN">영어</MenuItem>
                                        <MenuItem value="JP">일본어</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* 장르 */}
                            <Box>
                                <Typography sx={{ mb: 1.5, fontWeight: 600 }}>4. 장르</Typography>
                                <TextField
                                    fullWidth
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Box>

                            {/* 내용 */}
                            <Box>
                                <Typography sx={{ mb: 1.5, fontWeight: 600 }}>5. 내용</Typography>
                                <TextField
                                    fullWidth
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    multiline
                                    rows={6}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* 등록/수정 버튼 */}
                <Box sx={{ textAlign: "center" }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!coverImage}
                        sx={{
                            width: 280,
                            py: 1.8,
                            bgcolor: "#4285f4",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: 600,
                            borderRadius: 1.5
                        }}
                    >
                        {isEditMode ? "수정" : "등록"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
