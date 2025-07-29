import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Header from './components/Header';
import ClothingList from './pages/ClothingList';
import AddClothing from './pages/AddClothing';
import ClothingDetail from './pages/ClothingDetail';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2c3e50',
            light: '#34495e',
            dark: '#1a252f',
        },
        secondary: {
            main: '#95a5a6',
            light: '#bdc3c7',
            dark: '#7f8c8d',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#2c3e50',
            secondary: '#7f8c8d',
        },
        grey: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
        },
    },
    typography: {
        fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            color: '#2c3e50',
            fontSize: 'clamp(1.5rem, 4vw, 2.125rem)',
        },
        h6: {
            fontWeight: 600,
            color: '#2c3e50',
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
        },
        body1: {
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
        },
        body2: {
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
        },
    },
    shape: {
        borderRadius: 12,
    },

    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 24px)',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                },
                contained: {
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)',
                    },
                },
                outlined: {
                    borderColor: '#2c3e50',
                    color: '#2c3e50',
                    '&:hover': {
                        backgroundColor: 'rgba(44, 62, 80, 0.04)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)',
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                },
                colorPrimary: {
                    backgroundColor: '#2c3e50',
                    color: '#ffffff',
                },
                outlined: {
                    borderColor: '#2c3e50',
                    color: '#2c3e50',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                    },
                    '& .MuiInputBase-input': {
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                },
            },
        },
        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box
                    sx={{
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        backgroundAttachment: 'fixed',
                        '&::before': {
                            content: '""',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at 20% 80%, rgba(44, 62, 80, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(149, 165, 166, 0.03) 0%, transparent 50%)',
                            pointerEvents: 'none',
                        }
                    }}
                >
                    <Header />
                    <Box
                        sx={{
                            py: {
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 4
                            },
                            px: {
                                xs: 0.5,
                                sm: 1,
                                md: 2,
                                lg: 3
                            },
                            position: 'relative',
                            zIndex: 1,
                            maxWidth: '100%',
                            mx: 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: {
                                    xs: 1,
                                    sm: 2,
                                    md: 3
                                },
                                p: {
                                    xs: 1,
                                    sm: 2,
                                    md: 3
                                },
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                maxWidth: '100%',
                                mx: 'auto',
                            }}
                        >
                            <Routes>
                                <Route path="/" element={<ClothingList />} />
                                <Route path="/list" element={<ClothingList />} />
                                <Route path="/add" element={<AddClothing />} />
                                <Route path="/detail/:id" element={<ClothingDetail />} />
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App; 