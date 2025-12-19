import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import {
  createBook,
  getBook,
  updateBook,
  saveAiCover,
  generateAiCover,
} from "../services/bookService";


export default function BookCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: "",
    language: "",
    genre: "",
    content: "",
    introduction: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [openAiKey, setOpenAiKey] = useState("");
  const [imageMode, setImageMode] = useState("none");

  // 책 등록 조건
 const basicFilled =
  formData.title.trim() !== "" &&
  formData.language.trim() !== "" &&
  formData.genre.trim() !== "" &&
  formData.introduction.trim() !== "" &&
  formData.content.trim() !== "";
  const canSubmit =
    // 이미지 생성 안 함 → 바로 가능
    imageMode === "none" ||
    // AI 생성 모드 → coverImage 있어야 가능
    (imageMode === "ai" && coverImage);

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (!isEditMode) return;

    const loadBook = async () => {
      try {
        const book = await getBook(id);

        setFormData({
          title: book.title || "",
          language: book.language || "",
          genre: book.genre || "",
          content: book.content || "",
          introduction: book.introduction || "",
        });

        // 서버에서 내려주는 표지 URL (BookResponse 에 coverImageUrl 있다고 가정)
        setCoverImage(book.coverImageUrl || null);
      } catch (error) {
        console.error(error);
        alert("책 정보를 불러오지 못했습니다.");
      }
    };

    loadBook();
  }, [id, isEditMode]);

  // 입력값 변경 처리
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 표지 생성 (프론트에서 OpenAI 호출)
  const handleGenerateCover = async () => {
    if (!openAiKey) {
      alert("먼저 OpenAI API Key를 입력해주세요.");
      return;
    }

    if (
      !formData.title ||
      !formData.content ||
      !formData.genre ||
      !formData.language
    ) {
      alert("제목, 언어, 장르, 내용을 먼저 입력해주세요.");
      return;
    }

    const prompt = `
Create a high-quality book cover illustration.

Title: "${formData.title}"
Language: ${formData.language}
Genre: ${formData.genre}
Introduction: ${
      formData.introduction || "No introduction provided."
    }
Content summary: ${
      formData.content?.slice(0, 300) || "No content provided."
    }

Style: Modern, eye-catching cover that fits the genre.
    `.trim();

    setIsGenerating(true);
    try {
        const imageUrl = await generateAiCover({
          prompt,
          apiKey: openAiKey,
        });

      if (!imageUrl) {
        throw new Error("이미지 URL을 받아오지 못했습니다.");
      }

      // 미리보기용으로 상태에 저장
      setCoverImage(imageUrl);
      alert("표지가 생성되었습니다!");
    } catch (error) {
      console.error(error);
      alert("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 등록 / 수정 처리 + 표지 URL 저장
const handleSubmit = async () => {
  let finalCover = coverImage; // 기본값(AI 생성 or 업로드 미리보기)

  // (1) 이미지 생성 안 함
  if (imageMode === "none") {
    finalCover = null;
  }

  // (AI 모드는 기존처럼 coverImage 그대로)

  // 📌 기존 DTO 유지
  const dto = {
    title: formData.title,
    content: formData.content,
    language: formData.language,
    genre: formData.genre,
  };

  try {
    if (isEditMode) {
      await updateBook(id, dto);
      await saveAiCover(Number(id), finalCover);
    } else {
      const created = await createBook(dto);
      await saveAiCover(created.id, finalCover);
    }

    alert("작업이 완료되었습니다!");
    navigate("/mypage");

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
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {/* 페이지 제목 */}
        <Typography
          variant="h4"
          sx={{
            mb: 5,
            textAlign: "center",
            fontWeight: 700,
            color: "#212529",
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
            mb: 5,
          }}
        >
          {/* 왼쪽: 표지 미리보기 + API 키 입력 + 버튼 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
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
                border: "1px solid #dee2e6",
              }}
            >
              {!coverImage && (
                <Typography variant="h6" color="text.secondary">
                  표지 미리보기
                </Typography>
              )}
            </Paper>

            {/* 이미지 생성 방식 선택 */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>표지 생성 방식 선택</Typography>

              <label style={{ display: "block", marginBottom: "4px" }}>
                <input
                  type="radio"
                  value="none"
                  checked={imageMode === "none"}
                  onChange={() => setImageMode("none")}
                />
                이미지 생성 안 함
              </label>

              <label style={{ display: "block", marginBottom: "4px" }}>
                <input
                  type="radio"
                  value="ai"
                  checked={imageMode === "ai"}
                  onChange={() => setImageMode("ai")}
                />
                AI로 자동 생성
              </label>
            </Box>

            {/* OpenAI API Key 입력 - ai 선택 시에만 나오도록 수정 */}
            {imageMode === "ai" && (
              <TextField
                type="password"
                label="OpenAI API Key"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                size="small"
                sx={{
                  width: 280,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f1f3f5",
                    borderRadius: 1.5,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            )}

            {imageMode === "ai" && (
              <Button
                variant="contained"
                onClick={handleGenerateCover}
                disabled={
                  isGenerating ||
                  !formData.title ||
                  !(formData.introduction && formData.introduction.length > 0) ||
                  !openAiKey ||
                  imageMode !== "ai"
                }
                sx={{
                  width: 220,
                  py: 1.5,
                  bgcolor: "#adb5bd",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 600,
                  borderRadius: 1.5,
                  textTransform: "none",
                }}
              >
                {isGenerating ? "생성 중..." : "표지 생성"}
              </Button>
            )}
          </Box>

          {/* 오른쪽: 입력 폼 */}
          <Paper
            elevation={0}
            sx={{
              width: 550,
              p: 4,
              borderRadius: 2,
              bgcolor: "#fff",
              border: "1px solid #dee2e6",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
              {/* 1. 제목 */}
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#495057",
                  }}
                >
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
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f1f3f5",
                      borderRadius: 1.5,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
              </Box>

              {/* 2. 언어 */}
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#495057",
                  }}
                >
                  2. 언어를 선택하시오
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      bgcolor: "#f1f3f5",
                      borderRadius: 1.5,
                      "& fieldset": { border: "none" },
                    }}
                  >
                    <MenuItem value="" disabled>
                      언어를 선택하세요
                    </MenuItem>
                    <MenuItem value="KO">한국어</MenuItem>
                    <MenuItem value="EN">영어</MenuItem>
                    <MenuItem value="JP">일본어</MenuItem>
                    <MenuItem value="CN">중국어</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* 3. 장르 */}
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#495057",
                  }}
                >
                  3. 장르를 선택하시오
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      bgcolor: "#f1f3f5",
                      borderRadius: 1.5,
                      "& fieldset": { border: "none" },
                    }}
                  >
                    <MenuItem value="" disabled>
                      장르를 선택하세요
                    </MenuItem>
                    <MenuItem value="FANTASY">판타지</MenuItem>
                    <MenuItem value="ROMANCE">로맨스</MenuItem>
                    <MenuItem value="THRILLER">스릴러</MenuItem>
                    <MenuItem value="SF">SF</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* 4. 소개글 */}
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#495057",
                  }}
                >
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
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f1f3f5",
                      borderRadius: 1.5,
                      "& fieldset": { border: "none" },
                    },
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
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#495057",
                  }}
                >
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
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f1f3f5",
                      borderRadius: 1.5,
                      "& fieldset": { border: "none" },
                    },
                  }}
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
            disabled={!canSubmit || !basicFilled}
            sx={{
              width: 280,
              py: 1.8,
              bgcolor: "#4285f4",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: 1.5,
              boxShadow: "none",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#3367d6",
                boxShadow: "none",
              },
              "&:disabled": {
                bgcolor: "#dee2e6",
                color: "#adb5bd",
              },
            }}
          >
            {isEditMode ? "수정" : "등록"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
