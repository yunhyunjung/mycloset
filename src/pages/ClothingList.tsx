import React, { useState, useEffect } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Chip,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Fab,
    CircularProgress,
    Alert,
    Paper,
    Button,
    Tooltip
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon, Checkroom as CheckroomIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ClothingItem } from '../types';
import { CATEGORIES } from '../types';
import { dbService } from '../utils/database';

const ClothingList: React.FC = () => {
    const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadClothingItems();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredItems(clothingItems);
        } else {
            const filtered = clothingItems.filter(item => item.category === selectedCategory);
            setFilteredItems(filtered);
        }
    }, [selectedCategory, clothingItems]);

    const loadClothingItems = async () => {
        try {
            setLoading(true);
            const items = await dbService.getAllClothing();
            setClothingItems(items);
            setFilteredItems(items);
        } catch (err) {
            setError('의류 목록을 불러오는데 실패했습니다.');
            console.error('Failed to load clothing items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value);
    };

    const handleItemClick = (id: string) => {
        navigate(`/detail/${id}`);
    };

    const getCategoryLabel = (categoryValue: string) => {
        const category = CATEGORIES.find(cat => cat.value === categoryValue);
        return category ? category.label : categoryValue;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {/* 헤더 섹션 */}
            <Box sx={{ mb: 4, mt: 2 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        color: '#2c3e50',
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    내 옷장
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    총 {clothingItems.length}개의 의류가 등록되어 있습니다
                </Typography>

                {/* 카테고리 필터 - 별도 라인으로 분리 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        카테고리:
                    </Typography>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #e0e0e0',
                            borderRadius: 3,
                            minWidth: 200,
                        }}
                    >
                        <FormControl fullWidth>
                            <InputLabel sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FilterIcon fontSize="small" />
                                선택
                            </InputLabel>
                            <Select
                                value={selectedCategory}
                                label="선택"
                                onChange={handleCategoryChange}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="all">전체 ({clothingItems.length})</MenuItem>
                                {CATEGORIES.map((category) => {
                                    const count = clothingItems.filter(item => item.category === category.value).length;
                                    return (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label} ({count})
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Paper>
                </Box>
            </Box>

            {/* 빈 화면 또는 의류 목록 */}
            {filteredItems.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid #e0e0e0',
                        borderRadius: 4,
                        maxWidth: 500,
                        mx: 'auto',
                    }}
                >
                    {/* 일러스트 추가 */}
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                            opacity: 0.8,
                        }}
                    >
                        <CheckroomIcon sx={{ fontSize: 48, color: 'white' }} />
                    </Box>

                    {/* 강조된 메시지 */}
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#2c3e50',
                            fontWeight: 600,
                            mb: 2
                        }}
                    >
                        {selectedCategory === 'all' ? '등록된 옷이 없습니다.' : '해당 카테고리의 옷이 없습니다.'}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            mb: 4,
                            color: '#2c3e50',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            '&:hover': {
                                color: '#34495e',
                            }
                        }}
                        onClick={() => navigate('/add')}
                    >
                        새로운 옷을 추가해보세요!
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/add')}
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                        }}
                    >
                        첫 번째 옷 추가하기
                    </Button>
                </Paper>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 3,
                    maxWidth: 1200,
                    mx: 'auto',
                }}>
                    {filteredItems.map((item, index) => (
                        <Card
                            key={item.id}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                maxWidth: 350,
                                mx: 'auto',
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                },
                                '@keyframes fadeInUp': {
                                    '0%': {
                                        opacity: 0,
                                        transform: 'translateY(30px)',
                                    },
                                    '100%': {
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                    },
                                },
                            }}
                            onClick={() => handleItemClick(item.id)}
                        >
                            <CardMedia
                                component="img"
                                height="250"
                                image={item.imageUrl}
                                alt={getCategoryLabel(item.category)}
                                sx={{
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                            />
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    gutterBottom
                                    sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}
                                >
                                    {getCategoryLabel(item.category)}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                    <Chip
                                        label={item.size}
                                        size="small"
                                        color="primary"
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Chip
                                        label={item.color}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2,
                                            borderColor: '#2c3e50',
                                            color: '#2c3e50',
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    구입일: {new Date(item.buyDate).toLocaleDateString('ko-KR')}
                                </Typography>
                                {item.shop && (
                                    <Typography variant="body2" color="text.secondary">
                                        구입처: {item.shop}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* 플로팅 액션 버튼 - 툴팁 추가 */}
            <Tooltip
                title="옷 추가하기"
                placement="left"
                arrow
            >
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 56,
                        height: 56,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1) rotate(90deg)',
                        }
                    }}
                    onClick={() => navigate('/add')}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
        </Box>
    );
};

export default ClothingList; 