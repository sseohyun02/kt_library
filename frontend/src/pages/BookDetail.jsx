import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function BookDetail() {
    const location = useLocation();
    const {title, author, image} = location.state || {};

    return (
        <Box sx={{ display: 'flex', p: 2 }}>
            {/* 왼쪽 이미지 */}
            <Box
                sx={{
                    width: '400px',
                    height: '600px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    mr: 4 // 오른쪽 여백
                }}
            >
                {image ? (
                    <img
                        src={image}
                        alt={title}
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

            {/* 오른쪽 컨테이너 */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    pl: 6, // 텍스트 전체를 오른쪽으로 이동 (padding-left)
                    maxWidth : 800,
                    ml: 10
                }}
            >
                {/* 책 제목 (왼쪽 정렬) */}
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
                    {title || '책 제목'}
                </Box>

                {/* 오른쪽 끝으로 붙일 정보 컨테이너 */}
                <Box
                    sx={{
                        alignSelf: 'flex-end',   // 부모 flex 방향 기준 오른쪽 끝으로 정렬
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                        maxWidth: 400,
                        mb: 3,
                    }}
                >
                    {[
                        { label: '저자', value: author },
                        { label: '장르', /*value: genre*/ },
                        { label: '언어', /*value: language*/ },
                        { label: '전체 페이지 수', /*value: pages*/ },
                    ].map(({ label, value }) => (
                        <Box
                            key={label}
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                px: 2,
                                py: 1,
                                textAlign: 'right',
                            }}
                        >
                            {label}: {value || '-'}
                        </Box>
                    ))}
                </Box>

                {/* 줄거리 (왼쪽 정렬) */}
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        p: 3,
                        minHeight: 200,
                        whiteSpace: 'pre-wrap',
                        overflowY: 'auto',
                        textAlign: 'left',
                    }}
                >
                    {/*{summary || '대충 줄거리 or 소개글'}*/}
                    줄거리
                </Box>

                {/* 등록일, 최종 수정일 오른쪽 끝 정렬 */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        alignSelf: 'flex-end',  // 오른쪽 끝 붙임
                    }}
                >
                    {[
                        { label: '등록일', /*value: createdAt*/ },
                        { label: '최종 수정일', /*value: updatedAt*/ }
                    ].map(({ label, value }) => (
                        <Box
                            key={label}
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                px: 2,
                                py: 1,
                                minWidth: 150,
                                textAlign: 'right',
                            }}
                        >
                            {label}: {value || '-'}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );

}
