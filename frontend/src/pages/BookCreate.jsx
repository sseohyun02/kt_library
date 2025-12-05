import { TextField, Button, Box } from "@mui/material";

export default function BookCreate() {
    return (
        <Box sx={{ maxWidth: 400, mt: 2 }}>
            <h2>도서 등록</h2>

            <TextField
                label="제목"
                fullWidth
                margin="normal"
                variant="outlined"
            />

            <TextField
                label="저자"
                fullWidth
                margin="normal"
                variant="outlined"
            />

            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                등록하기
            </Button>
        </Box>
    );
}
