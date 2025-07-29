import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
    Chip,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import type { ClothingItem } from '../types';
import { dbService } from '../utils/database';
import { CATEGORIES } from '../types';

const ClothingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [clothing, setClothing] = useState<ClothingItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [coordinateDialogOpen, setCoordinateDialogOpen] = useState(false);
    const [newCoordinate, setNewCoordinate] = useState({ photoUrl: '', date: '', description: '' });

    useEffect(() => {
        if (id) {
            loadClothingItem();
        }
    }, [id]);

    const loadClothingItem = async () => {
        try {
            setLoading(true);
            const item = await dbService.getClothingById(id!);
            if (item) {
                setClothing(item);
            } else {
                setError('옷을 찾을 수 없습니다.');
            }
        } catch (err) {
            setError('옷 정보를 불러오는데 실패했습니다.');
            console.error('Failed to load clothing item:', err);
        } finally {
            setLoading(false);
        }
    };



    const handleDelete = async () => {
        if (!clothing) return;

        try {
            await dbService.deleteClothing(clothing.id);
            setDeleteDialogOpen(false);
            navigate('/');
        } catch (err) {
            setError('삭제에 실패했습니다.');
            console.error('Failed to delete clothing:', err);
        }
    };

    const handleAddCoordinate = async () => {
        if (!clothing || !newCoordinate.photoUrl || !newCoordinate.date) {
            setError('사진과 날짜를 입력해주세요.');
            return;
        }

        try {
            await dbService.addCoordinate(clothing.id, newCoordinate);
            await loadClothingItem(); // 목록 새로고침
            setCoordinateDialogOpen(false);
            setNewCoordinate({ photoUrl: '', date: '', description: '' });
            setError('');
        } catch (err) {
            setError('코디네이트 추가에 실패했습니다.');
            console.error('Failed to add coordinate:', err);
        }
    };

    const handleDeleteCoordinate = async (coordinateId: string) => {
        if (!clothing) return;

        try {
            await dbService.deleteCoordinate(clothing.id, coordinateId);
            await loadClothingItem(); // 목록 새로고침
        } catch (err) {
            setError('코디네이트 삭제에 실패했습니다.');
            console.error('Failed to delete coordinate:', err);
        }
    };

    const getCategoryLabel = (category: string) => {
        return CATEGORIES.find(cat => cat.value === category)?.label || category;
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>로딩 중...</Typography>
            </Box>
        );
    }

    if (error && !clothing) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => navigate('/')}>
                    목록으로 돌아가기
                </Button>
            </Box>
        );
    }

    if (!clothing) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>옷을 찾을 수 없습니다.</Typography>
                <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                    목록으로 돌아가기
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* 헤더 */}
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                >
                    목록으로 돌아가기
                </Button>

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
                    옷 상세 정보
                </Typography>
            </Box>

            {/* 에러 메시지 */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* 메인 콘텐츠 */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: '1fr 1fr',
                    },
                    gap: { xs: 3, sm: 4, md: 6 },
                    alignItems: 'start',
                }}
            >
                {/* 이미지 섹션 */}
                <Box>
                    <Card
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        }}
                    >
                        <CardMedia
                            component="img"
                            height={isSmallMobile ? 300 : isMobile ? 400 : 500}
                            image={clothing.imageUrl}
                            alt={getCategoryLabel(clothing.category)}
                            sx={{
                                objectFit: 'cover',
                            }}
                        />
                    </Card>
                </Box>

                {/* 정보 섹션 */}
                <Box>
                    <Paper
                        sx={{
                            p: { xs: 2, sm: 3 },
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 3,
                            mb: { xs: 3, sm: 4 },
                        }}
                    >
                        {/* 제목과 액션 버튼 */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: { xs: 2, sm: 3 },
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 1, sm: 2 },
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                }}
                            >
                                {getCategoryLabel(clothing.category)}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: { xs: 1, sm: 1.5 },
                                    flexDirection: { xs: 'row', sm: 'row' },
                                }}
                            >

                                <Button
                                    variant="outlined"
                                    color="error"
                                    size={isSmallMobile ? 'small' : 'medium'}
                                    startIcon={<DeleteIcon />}
                                    onClick={() => setDeleteDialogOpen(true)}
                                    sx={{
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        px: { xs: 1.5, sm: 2 },
                                        py: { xs: 0.5, sm: 0.75 },
                                    }}
                                >
                                    {isSmallMobile ? '삭제' : '삭제'}
                                </Button>
                            </Box>
                        </Box>

                        {/* 기본 정보 */}
                        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: { xs: 1, sm: 1.5 },
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                }}
                            >
                                기본 정보
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                                    gap: { xs: 1.5, sm: 2 },
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            mb: 0.5,
                                        }}
                                    >
                                        카테고리
                                    </Typography>
                                    <Chip
                                        label={getCategoryLabel(clothing.category)}
                                        color="primary"
                                        size={isSmallMobile ? 'small' : 'medium'}
                                        sx={{
                                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            mb: 0.5,
                                        }}
                                    >
                                        사이즈
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            fontWeight: 500,
                                        }}
                                    >
                                        {clothing.size}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            mb: 0.5,
                                        }}
                                    >
                                        색상
                                    </Typography>
                                    <Chip
                                        label={clothing.color}
                                        variant="outlined"
                                        size={isSmallMobile ? 'small' : 'medium'}
                                        sx={{
                                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            mb: 0.5,
                                        }}
                                    >
                                        구입일
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            fontWeight: 500,
                                        }}
                                    >
                                        {clothing.buyDate ? new Date(clothing.buyDate).toLocaleDateString('ko-KR') : '-'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* 추가 정보 */}
                        {(clothing.shop || clothing.material || clothing.washing) && (
                            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        mb: { xs: 1, sm: 1.5 },
                                        fontSize: { xs: '1rem', sm: '1.125rem' },
                                    }}
                                >
                                    추가 정보
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                                        gap: { xs: 1.5, sm: 2 },
                                    }}
                                >
                                    {clothing.shop && (
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    mb: 0.5,
                                                }}
                                            >
                                                구입처
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {clothing.shop}
                                            </Typography>
                                        </Box>
                                    )}

                                    {clothing.material && (
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    mb: 0.5,
                                                }}
                                            >
                                                소재
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {clothing.material}
                                            </Typography>
                                        </Box>
                                    )}

                                    {clothing.washing && (
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    mb: 0.5,
                                                }}
                                            >
                                                세탁 방법
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {clothing.washing}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Paper>

                    {/* 코디네이트 섹션 */}
                    <Paper
                        sx={{
                            p: { xs: 2, sm: 3 },
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: { xs: 2, sm: 3 },
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                }}
                            >
                                코디네이트 ({clothing.coordinates.length})
                            </Typography>
                            <Button
                                variant="contained"
                                size={isSmallMobile ? 'small' : 'medium'}
                                startIcon={<AddIcon />}
                                onClick={() => setCoordinateDialogOpen(true)}
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    px: { xs: 1.5, sm: 2 },
                                    py: { xs: 0.5, sm: 0.75 },
                                }}
                            >
                                {isSmallMobile ? '추가' : '코디 추가'}
                            </Button>
                        </Box>

                        {clothing.coordinates.length === 0 ? (
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    py: 3,
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                }}
                            >
                                아직 등록된 코디네이트가 없습니다.
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    },
                                    gap: { xs: 2, sm: 3 },
                                }}
                            >
                                {clothing.coordinates.map((coordinate) => (
                                    <Card
                                        key={coordinate.id}
                                        sx={{
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height={150}
                                            image={coordinate.photoUrl}
                                            alt="Coordinate"
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 500,
                                                    mb: 1,
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                }}
                                            >
                                                {new Date(coordinate.date).toLocaleDateString('ko-KR')}
                                            </Typography>
                                            {coordinate.description && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                                        mb: 1,
                                                    }}
                                                >
                                                    {coordinate.description}
                                                </Typography>
                                            )}
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteCoordinate(coordinate.id)}
                                                sx={{
                                                    fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                                    px: 1,
                                                    py: 0.5,
                                                }}
                                            >
                                                삭제
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>옷 삭제</DialogTitle>
                <DialogContent>
                    <Typography>
                        정말로 이 옷을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 코디네이트 추가 다이얼로그 */}
            <Dialog
                open={coordinateDialogOpen}
                onClose={() => setCoordinateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>코디네이트 추가</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="사진 URL"
                            value={newCoordinate.photoUrl}
                            onChange={(e) => setNewCoordinate(prev => ({ ...prev, photoUrl: e.target.value }))}
                            fullWidth
                            required
                        />
                        <TextField
                            label="날짜"
                            type="date"
                            value={newCoordinate.date}
                            onChange={(e) => setNewCoordinate(prev => ({ ...prev, date: e.target.value }))}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="설명 (선택사항)"
                            value={newCoordinate.description}
                            onChange={(e) => setNewCoordinate(prev => ({ ...prev, description: e.target.value }))}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCoordinateDialogOpen(false)}>취소</Button>
                    <Button onClick={handleAddCoordinate} variant="contained">
                        추가
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClothingDetail; 