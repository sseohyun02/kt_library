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

    // 📌 폼 데이터 상태
    const [formData, setFormData] = useState({
        title: '',
        language: '',
        genre: '',
        content: '',
        introduction: ''
    });

    const [coverImage, setCoverImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // 📌 수정 모드일 때 기존 데이터 로드
    useEffect(() => {
        if (!isEditMode) return;

        const loadBook = async () => {
            try {
                const book = await getBook(id);

                setFormData({
                    title: book.title || '',
                    language: book.language || '',
                    genre: book.genre || '',
                    content: book.content || '',
                    introduction: book.introduction || ''
                });

                // 서버 책 이미지 (Image 엔티티 있다면 여기 맞춰서 사용)
                setCoverImage(book?.image?.imageUrl || null);

            } catch (error) {
                console.error(error);
                alert("책 정보를 불러오지 못했습니다.");
            }
        };

        loadBook();
    }, [id, isEditMode]);

    // 📌 입력값 변경 처리
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 📌 표지 생성 (Mock)
    const handleGenerateCover = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setCoverImage('https://via.placeholder.com/300x400/4A90E2/ffffff?text=AI+Generated+Cover');
            setIsGenerating(false);
            alert('표지가 생성되었습니다!');
        }, 2000);
    };

    // 📌 등록 / 수정 처리
    const handleSubmit = async () => {
        if (!coverImage) {
            alert('먼저 표지를 생성해주세요!');
            return;
        }

        // 🔥 백엔드 DTO: title, content, author, language, genre
        // author는 백엔드에서 로그인 유저 이름으로 채우고 있어서 여기선 안 보냄
        const dto = {
            title: formData.title,
            content: formData.content,
            language: formData.language, // KO / EN / JP / CN
            genre: formData.genre        // NOVEL / ESSAY / HISTORY / FANTASY
            // introduction, coverImage는 현재 백엔드 DTO에 없으니 굳이 안 보내도 되지만
            // Jackson이 기본 설정이면 추가 필드는 무시되므로 큰 문제는 없음.
        };

        try {
            if (isEditMode) {
                await updateBook(id, dto);
                alert('도서가 수정되었습니다!');
            } else {
                await createBook(dto);
                alert('도서가 등록되었습니다!');
            }

            navigate('/mypage');
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
            <Box sx={{
                maxWidth: 1100,
                mx: 'auto'
            }}>
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
                                boxShadow: 'none',
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#868e96',
                                    boxShadow: 'none'
                                },
                                '&:disabled': {
                                    bgcolor: '#dee2e6',
                                    color: '#adb5bd'
                                }
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

                            {/* 1. 제목 */}
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600, fontSize: '15px', color: '#495057' }}>
                                    1. 제목을 입력하시오
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="책 제목을 입력하세요"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: '#f1f3f5',
                                            borderRadius: 1.5,
                                            '& fieldset': { border: 'none' }
                                        }
                                    }}
                                />
                            </Box>

                            {/* 2. 언어 (백엔드 enum: KO, EN, JP, CN) */}
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600, fontSize: '15px', color: '#495057' }}>
                                    2. 언어를 선택하시오
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{
                                            bgcolor: '#f1f3f5',
                                            borderRadius: 1.5,
                                            '& fieldset': { border: 'none' }
                                        }}
                                    >
                                        <MenuItem value="" disabled>언어를 선택하세요</MenuItem>
                                        <MenuItem value="KO">한국어</MenuItem>
                                        <MenuItem value="EN">영어</MenuItem>
                                        <MenuItem value="JP">일본어</MenuItem>
                                        <MenuItem value="CN">중국어</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* 3. 장르 (백엔드 enum: NOVEL, ESSAY, HISTORY, FANTASY) */}
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600, fontSize: '15px', color: '#495057' }}>
                                    3. 장르를 선택하시오
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{
                                            bgcolor: '#f1f3f5',
                                            borderRadius: 1.5,
                                            '& fieldset': { border: 'none' }
                                        }}
                                    >
                                        <MenuItem value="" disabled>장르를 선택하세요</MenuItem>
                                        <MenuItem value="NOVEL">소설</MenuItem>
                                        <MenuItem value="ESSAY">에세이</MenuItem>
                                        <MenuItem value="HISTORY">역사</MenuItem>
                                        <MenuItem value="FANTASY">판타지</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* 4. 소개글 */}
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600, fontSize: '15px', color: '#495057' }}>
                                    4. 소개글을 입력하시오(200자 이내)
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="introduction"
                                    value={formData.introduction}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    placeholder="책의 소개글을 입력해주세요"
                                    variant="outlined"
                                    inputProps={{ maxLength: 200 }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: '#f1f3f5',
                                            borderRadius: 1.5,
                                            '& fieldset': { border: 'none' }
                                        }
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        textAlign: "right",
                                        mt: 0.5,
                                        mr: 0.5,
                                        color: "#868e96",
                                    }}
                                >
                                    {`${formData.introduction?.length || 0} / 200`}
                                </Typography>
                            </Box>

                            {/* 5. 내용 */}
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600, fontSize: '15px', color: '#495057' }}>
                                    5. 내용을 입력하시오
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    multiline
                                    rows={6}
                                    placeholder="책의 내용을 입력해주세요"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: '#f1f3f5',
                                            borderRadius: 1.5,
                                            '& fieldset': { border: 'none' }
                                        }
                                    }}
                                />
                            </Box>

                        </Box>
                    </Paper>
                </Box>

                {/* 등록/수정 버튼 */}
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!coverImage}
                        sx={{
                            width: 280,
                            py: 1.8,
                            bgcolor: '#4285f4',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 600,
                            borderRadius: 1.5,
                            boxShadow: 'none',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#3367d6',
                                boxShadow: 'none'
                            },
                            '&:disabled': {
                                bgcolor: '#dee2e6',
                                color: '#adb5bd'
                            }
                        }}
                    >
                        {isEditMode ? '수정' : '등록'}
                    </Button>
                </Box>

            </Box>
        </Box>
    );
}
