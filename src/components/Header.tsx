import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Box, useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import CheckroomIcon from '@mui/icons-material/Checkroom';

const Header: React.FC = () => {
    const location = useLocation();
    const theme = useTheme();

    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isActive = (path: string) => location.pathname === path;

    return (
        <AppBar
            position="static"
            sx={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Toolbar
                sx={{
                    px: { xs: 1, sm: 2, md: 3 },
                    py: { xs: 0.5, sm: 1 },
                    minHeight: { xs: 48, sm: 56, md: 64 },
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <Avatar
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            width: { xs: 32, sm: 40, md: 48 },
                            height: { xs: 32, sm: 40, md: 48 },
                        }}
                    >
                        <CheckroomIcon
                            sx={{
                                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                                color: 'white'
                            }}
                        />
                    </Avatar>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                            fontWeight: 700,
                            color: 'white',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        MyCloset
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: { xs: 0.5, sm: 1, md: 2 },
                        flexDirection: { xs: 'row', sm: 'row' },
                    }}
                >
                    <Button
                        component={Link}
                        to="/"
                        sx={{
                            color: 'white',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            py: { xs: 0.5, sm: 0.75 },
                            minWidth: { xs: 'auto', sm: 'auto' },
                            textDecoration: isActive('/') ? 'underline' : 'none',
                            textUnderlineOffset: '4px',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px',
                            },
                            ...(isActive('/') && {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                            }),
                        }}
                    >
                        {isSmallMobile ? '목록' : '옷장 목록'}
                    </Button>
                    <Button
                        component={Link}
                        to="/add"
                        sx={{
                            color: 'white',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            py: { xs: 0.5, sm: 0.75 },
                            minWidth: { xs: 'auto', sm: 'auto' },
                            textDecoration: isActive('/add') ? 'underline' : 'none',
                            textUnderlineOffset: '4px',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px',
                            },
                            ...(isActive('/add') && {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                            }),
                        }}
                    >
                        {isSmallMobile ? '추가' : '옷 추가'}
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 