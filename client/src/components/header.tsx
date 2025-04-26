import { AppBar, Toolbar, Typography, useTheme, useMediaQuery } from '@mui/material';

export const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position="static" component="header" role="banner">
            <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontSize: {
                            xs: '0.9rem',
                            sm: '1.1rem',
                            md: '1.25rem'
                        },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    Runtimer ;^)
                </Typography>
            </Toolbar>
        </AppBar>
    );
}