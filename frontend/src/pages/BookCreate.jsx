import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Paper, Typography, Select, MenuItem, FormControl } from "@mui/material";
import { mockBooks } from '../data/mockBooks';

export default function BookCreate() {
    const { id } = useParams(); // URL에서 id 가져오기
    const navigate = useNavigate(); // 페이지 이동 도구 준비
    const isEditMode = !!id; // id가 있으면 수정 모드

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        title: '',
        language: '',
        genre: '',
        content: '',
        introduction: ''
    });

    const [coverImage, setCoverImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // 수정 모드일 때 기존 데이터 불러오기
    useEffect(() => {
        // 수정 모드가 아니거나 id가 없으면 실행 안 함
        if (!isEditMode || !id) return;

        // mockBooks에서 해당 책 찾기
        const book = mockBooks.find(b => b.id === parseInt(id));

        // 책을 찾았으면 폼에 데이터 채우기
        if (book) {
            setFormData({
                title: book.title || '',
                language: book.language || '한국어', // mockBooks에서 가져오기
                genre: book.genre || '',
                content: book.description || '',
                introduction: book.introduction || ''
            });
            setCoverImage(book.coverImage || null);
        }
    }, [id, isEditMode]);

    // 입력값 변경 처리
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 표지 생성 (Mock)
    const handleGenerateCover = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setCoverImage('https://via.placeholder.com/300x400/4A90E2/ffffff?text=AI+Generated+Cover');
            setIsGenerating(false);
            alert('표지가 생성되었습니다!');
        }, 2000);
    };

    // 등록/수정 처리
    const handleSubmit = () => {
        // 표지가 없으면 경고
        if (!coverImage) {
            alert('먼저 표지를 생성해주세요!');
            return;
        }

        // 콘솔에 데이터 출력 (개발용)
        console.log(isEditMode ? '수정 데이터:' : '등록 데이터:', {
            ...formData,
            coverImage
        });

        // 성공 메시지
        alert(isEditMode ? '도서가 수정되었습니다!' : '도서가 등록되었습니다!');

        // 마이페이지로 이동
        navigate('/mypage');
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
                                            '& fieldset': {
                                                border: 'none'
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* 2. 언어 */}
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
                                            '& fieldset': {
                                                border: 'none'
                                            }
                                        }}
                                    >
                                        <MenuItem value="" disabled>언어를 선택하세요</MenuItem>
                                        <MenuItem value="한국어">한국어</MenuItem>
                                        <MenuItem value="영어">영어</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* 3. 장르 */}
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600, fontSize: '15px', color: '#495057' }}>
                                    3. 장르를 선택하시오
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        //fullWidth
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        //placeholder="예: 판타지, 로맨스, SF"
                                        //variant="outlined"
                                        //size="small"
                                        displayEmpty
                                        sx={{
                                            //'& .MuiOutlinedInput-root': {
                                            bgcolor: '#f1f3f5',
                                            borderRadius: 1.5,
                                            '& fieldset': {
                                                border: 'none'
                                            }
                                            //}
                                        }}
                                    >
                                        <MenuItem value="" disabled>장르를 선택하세요</MenuItem>
                                        <MenuItem value="SF">SF</MenuItem>
                                        <MenuItem value="로맨스">로맨스</MenuItem>
                                        <MenuItem value="공포">공포</MenuItem>
                                        <MenuItem value="추리">추리</MenuItem>
                                        <MenuItem value="개그">개그</MenuItem>
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
                                    inputProps = {{ // 200자 넘어가면 쓰지 못하도록
                                        maxLength : 200
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: '#f1f3f5',
                                            borderRadius: 1.5,
                                            '& fieldset': {
                                                border: 'none'
                                            }
                                        }
                                    }}
                                />

                                {/* 글자 수 표시 */}
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
                                            '& fieldset': {
                                                border: 'none'
                                            }
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