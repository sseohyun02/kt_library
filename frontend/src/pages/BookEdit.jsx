import { useParams, useNavigate } from "react-router-dom";
import { getBook, updateBook } from "../services/bookService";
import { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function BookEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        getBook(id).then((book) => {
            setTitle(book.title);
            setContent(book.content);
        });
    }, [id]);

    const handleSubmit = async () => {
        const data = {
            title,
            content,
            language: "KO",
            genre: "NOVEL"
        };

        await updateBook(id, data);
        navigate(`/books/${id}`);
    };

    return (
        <Box sx={{ maxWidth: 400, mt: 2 }}>
            <h2>도서 수정</h2>

            <TextField
                label="제목"
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
                label="내용"
                fullWidth
                margin="normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
                수정하기
            </Button>
        </Box>
    );
}
