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

import { createBook, getBook, updateBook } from "../services/bookService";

export default function BookCreate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // ------------------------------
    // 📌 폼 상태
    // ------------------------------
    const [formData, setFormData] = useState({
        title: '',
        language: '',
        genre: '',
        content: '',
        introduction: '',
        author: ''
    });

    const [coverImage, setCoverImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // ------------------------------
    // 📌 수정 모드 → 기존 데이터 로드
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

            } catch (error) {
                alert("책 정보를 불러오지 못했습니다.");
                console.error(error);
            }
        };

        loadBook();
    }, [id, isEditMode]);

    // ------------------------------
    // 폼 입력 변경
    // ------------------------------
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ------------------------------
    // 표지 생성 (Mock)
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
    // 등록 / 수정 처리
    // ------------------------------
    const handleSubmit = async () => {
        if (!coverImage) {
            alert("표지를 먼저 생성해주세요!");
            return;
        }

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
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", py: 6, px: 2 }}>
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
                    {/* 왼쪽: 표지 미리보기 */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                width: 480,
                                height: 675,
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

                    {/* 오른쪽 폼 */}
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
                                <Typography sx={labelText}>1. 제목</Typography>
                                <TextField
                                    fullWidth
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    size="small"
                                    sx={inputStyle}
                                />
                            </Box>

                            {/* 저자 */}
                            <Box>
                                <Typography sx={labelText}>2. 저자</Typography>
                                <TextField
                                    fullWidth
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    size="small"
                                    sx={inputStyle}
                                />
                            </Box>

                            {/* 언어 */}
                            <Box>
                                <Typography sx={labelText}>3. 언어</Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={selectStyle}
                                    >
                                        <MenuItem value="" disabled>언어 선택</MenuItem>
                                        <MenuItem value="KO">한국어</MenuItem>
                                        <MenuItem value="EN">영어</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* 장르 */}
                            <Box>
                                <Typography sx={labelText}>4. 장르</Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={selectStyle}
                                    >
                                        <MenuItem value="" disabled>장르 선택</MenuItem>
                                        <MenuItem value="SF">SF</MenuItem>
                                        <MenuItem value="로맨스">로맨스</MenuItem>
                                        <MenuItem value="공포">공포</MenuItem>
                                        <MenuItem value="추리">추리</MenuItem>
                                        <MenuItem value="개그">개그</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* 소개글 */}
                            <Box>
                                <Typography sx={labelText}>5. 소개글 (200자 이내)</Typography>
                                <TextField
                                    fullWidth
                                    name="introduction"
                                    value={formData.introduction}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    inputProps={{ maxLength: 200 }}
                                    sx={inputStyle}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{ display: "block", textAlign: "right", mt: 0.5, mr: 0.5, color: "#868e96" }}
                                >
                                    {`${formData.introduction.length} / 200`}
                                </Typography>
                            </Box>

                            {/* 내용 */}
                            <Box>
                                <Typography sx={labelText}>6. 내용</Typography>
                                <TextField
                                    fullWidth
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    multiline
                                    rows={6}
                                    sx={inputStyle}
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

// ----------------------
// 🔧 스타일 변수
// ----------------------
const labelText = {
    mb: 1.5,
    fontWeight: 600,
    fontSize: "15px",
    color: "#495057"
};

const inputStyle = {
    "& .MuiOutlinedInput-root": {
        bgcolor: "#f1f3f5",
        borderRadius: 1.5,
        "& fieldset": { border: "none" }
    }
};

const selectStyle = {
    bgcolor: "#f1f3f5",
    borderRadius: 1.5,
    "& fieldset": { border: "none" }
};
