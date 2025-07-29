import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Fab,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Add as AddIcon, Checkroom as CheckroomIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SelectChangeEvent } from '@mui/material';
import type { ClothingItem } from '../types';
import { dbService } from '../utils/database';
import { CATEGORIES } from '../types';

const ClothingList: React.FC = () => {
    const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        loadClothingItems();
    }, []);

    const loadClothingItems = async () => {
        try {
            const items = await dbService.getAllClothing();
            setClothingItems(items);
        } catch (error) {
            console.error('옷장 목록을 불러오는데 실패했습니다:', error);
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value);
    };

    const filteredItems = selectedCategory === 'all'
        ? clothingItems
        : clothingItems.filter(item => item.category === selectedCategory);

    const getCategoryLabel = (category: string) => {
        return CATEGORIES.find(cat => cat.value === category)?.label || category;
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* 헤더 섹션 */}
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                <Typography
                    variant="h4"
                    sx={{
                        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        mb: { xs: 1, sm: 2 },
                        textAlign: { xs: 'center', sm: 'left' },
                    }}
                >
                    내 옷장
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: { xs: 2, sm: 3 },
                        textAlign: { xs: 'center', sm: 'left' },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                >
                    총 {clothingItems.length}개의 옷이 있습니다
                </Typography>

                {/* 카테고리 필터 */}
                <Paper
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        maxWidth: { xs: '100%', sm: 300 },
                        mx: { xs: 'auto', sm: 0 },
                    }}
                >
                    <FormControl fullWidth size={isSmallMobile ? 'small' : 'medium'}>
                        <InputLabel
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                color: 'text.secondary'
                            }}
                        >
                            카테고리별 보기
                        </InputLabel>
                        <Select
                            value={selectedCategory}
                            label="카테고리별 보기"
                            onChange={handleCategoryChange}
                            sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                '& .MuiSelect-select': {
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                },
                            }}
                        >
                            <MenuItem value="all">전체</MenuItem>
                            {CATEGORIES.map((category) => (
                                <MenuItem key={category.value} value={category.value}>
                                    {category.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </Box>

            {/* 옷장 목록 */}
            {filteredItems.length === 0 ? (
                <Paper
                    sx={{
                        p: { xs: 3, sm: 4, md: 6 },
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        maxWidth: { xs: '100%', sm: 500 },
                        mx: 'auto',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: { xs: 2, sm: 3 },
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: 80, sm: 100, md: 120 },
                                height: { xs: 80, sm: 100, md: 120 },
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <CheckroomIcon
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                                    color: 'text.secondary',
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.primary',
                                fontWeight: 600,
                                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                            }}
                        >
                            아직 등록된 옷이 없습니다
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                maxWidth: 300,
                            }}
                        >
                            첫 번째 옷을 추가해서 나만의 디지털 옷장을 만들어보세요!
                        </Typography>
                        <Box
                            component="button"
                            onClick={() => navigate('/add')}
                            sx={{
                                mt: { xs: 1, sm: 2 },
                                px: { xs: 2, sm: 3 },
                                py: { xs: 1, sm: 1.5 },
                                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                boxShadow: '0 4px 12px rgba(44, 62, 80, 0.3)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(44, 62, 80, 0.4)',
                                },
                            }}
                        >
                            첫 번째 옷 추가하기
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <Box className="clothing-grid">
                    {filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                maxWidth: '100%',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                                },
                            }}
                            onClick={() => navigate(`/detail/${item.id}`)}
                        >
                            <CardMedia
                                component="img"
                                height={isSmallMobile ? 200 : isMobile ? 240 : 280}
                                image={item.imageUrl}
                                alt={getCategoryLabel(item.category)}
                                sx={{
                                    objectFit: 'cover',
                                    borderBottom: '1px solid #f0f0f0',
                                }}
                            />
                            <CardContent
                                sx={{
                                    p: { xs: 1.5, sm: 2 },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        fontSize: { xs: '1rem', sm: '1.125rem' },
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {getCategoryLabel(item.category)}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: { xs: 0.5, sm: 1 },
                                        mb: 1,
                                    }}
                                >
                                    <Chip
                                        label={getCategoryLabel(item.category)}
                                        color="primary"
                                        size={isSmallMobile ? 'small' : 'medium'}
                                        sx={{
                                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                        }}
                                    />
                                    <Chip
                                        label={item.color}
                                        variant="outlined"
                                        size={isSmallMobile ? 'small' : 'medium'}
                                        sx={{
                                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    }}
                                >
                                    {item.shop} • {item.size}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* 플로팅 액션 버튼 */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate('/add')}
                sx={{
                    position: 'fixed',
                    bottom: { xs: 16, sm: 24 },
                    right: { xs: 16, sm: 24 },
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    boxShadow: '0 8px 24px rgba(44, 62, 80, 0.3)',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 12px 32px rgba(44, 62, 80, 0.4)',
                    },
                }}
            >
                <AddIcon
                    sx={{
                        fontSize: { xs: '1.5rem', sm: '1.75rem' }
                    }}
                />
            </Fab>
        </Box>
    );
};

export default ClothingList; 