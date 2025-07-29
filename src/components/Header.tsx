import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Add as AddIcon, Home as HomeIcon, Checkroom as CheckroomIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === '/' || location.pathname === '/list';

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
            }}
        >
            <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                    onClick={() => navigate('/')}
                >
                    <Avatar
                        sx={{
                            mr: 2,
                            background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        }}
                    >
                        <CheckroomIcon />
                    </Avatar>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        MyCloset
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        color="inherit"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate('/')}
                        variant={isHome ? 'contained' : 'text'}
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1,
                            backgroundColor: isHome ? 'rgba(255,255,255,0.2)' : 'transparent',
                            backdropFilter: isHome ? 'blur(10px)' : 'none',
                            border: isHome ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                            position: 'relative',
                            transition: 'all 0.3s ease-in-out',
                            fontWeight: isHome ? 700 : 500,
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -2,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60%',
                                    height: 3,
                                    background: 'rgba(255,255,255,0.8)',
                                    borderRadius: 2,
                                }
                            },
                            '&::after': isHome ? {
                                content: '""',
                                position: 'absolute',
                                bottom: -2,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: 3,
                                background: 'rgba(255,255,255,0.8)',
                                borderRadius: 2,
                            } : {},
                        }}
                    >
                        옷장
                    </Button>

                    <Button
                        color="inherit"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/add')}
                        variant={location.pathname === '/add' ? 'contained' : 'text'}
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1,
                            backgroundColor: location.pathname === '/add' ? 'rgba(255,255,255,0.2)' : 'transparent',
                            backdropFilter: location.pathname === '/add' ? 'blur(10px)' : 'none',
                            border: location.pathname === '/add' ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                            position: 'relative',
                            transition: 'all 0.3s ease-in-out',
                            fontWeight: location.pathname === '/add' ? 700 : 500,
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -2,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60%',
                                    height: 3,
                                    background: 'rgba(255,255,255,0.8)',
                                    borderRadius: 2,
                                }
                            },
                            '&::after': location.pathname === '/add' ? {
                                content: '""',
                                position: 'absolute',
                                bottom: -2,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: 3,
                                background: 'rgba(255,255,255,0.8)',
                                borderRadius: 2,
                            } : {},
                        }}
                    >
                        옷 추가
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 