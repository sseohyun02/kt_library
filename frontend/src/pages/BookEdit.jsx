import { useParams } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";

export default function BookEdit() {
    const { id } = useParams();

    return (
        <Box sx={{ maxWidth: 400, mt: 2 }}>
            <h2>도서 수정</h2>
            <p>수정할 책 ID: {id}</p>

            <TextField
                label="제목"
                fullWidth
                margin="normal"
                variant="outlined"
                defaultValue="기존 제목"
            />

            <TextField
                label="저자"
                fullWidth
                margin="normal"
                variant="outlined"
                defaultValue="기존 저자"
            />

            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                수정하기
            </Button>
        </Box>
    );
}
