import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Layout({ children }) {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div">
                        도서 관리 시스템
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: 2 }}>
                {children}
            </Box>
        </>
    );
}
