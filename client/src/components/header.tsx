import { AppBar, Toolbar, Typography } from '@mui/material';

export const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    JavaScript Environments Performance Comparison
                </Typography>
            </Toolbar>
        </AppBar>
    );
}