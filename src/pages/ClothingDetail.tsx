import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
    Paper
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import type { ClothingItem } from '../types';
import { CATEGORIES } from '../types';
import { dbService } from '../utils/database';
import { convertImageToBase64, compressImage, validateImageFile } from '../utils/imageUtils';

const ClothingDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [clothing, setClothing] = useState<ClothingItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [coordinateDialogOpen, setCoordinateDialogOpen] = useState(false);
    const [coordinateImage, setCoordinateImage] = useState<string | null>(null);
    const [coordinateDescription, setCoordinateDescription] = useState('');

    useEffect(() => {
        if (id) {
            loadClothingDetail();
        }
    }, [id]);

    const loadClothingDetail = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const item = await dbService.getClothingById(id);
            if (item) {
                setClothing(item);
            } else {
                setError('의류를 찾을 수 없습니다.');
            }
        } catch (err) {
            setError('의류 정보를 불러오는데 실패했습니다.');
            console.error('Failed to load clothing detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!clothing || !window.confirm('정말로 이 의류를 삭제하시겠습니까?')) return;

        try {
            await dbService.deleteClothing(clothing.id);
            navigate('/');
        } catch (err) {
            setError('삭제에 실패했습니다.');
            console.error('Failed to delete clothing:', err);
        }
    };

    const handleCoordinateImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            validateImageFile(file);
            const compressedFile = await compressImage(file);
            const base64 = await convertImageToBase64(compressedFile);
            setCoordinateImage(base64);
        } catch (err) {
            setError(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.');
        }
    };

    const handleAddCoordinate = async () => {
        if (!clothing || !coordinateImage) {
            setError('코디 사진을 업로드해주세요.');
            return;
        }

        try {
            await dbService.addCoordinate(clothing.id, {
                photoUrl: coordinateImage,
                date: new Date().toISOString(),
                description: coordinateDescription
            });

            setCoordinateDialogOpen(false);
            setCoordinateImage(null);
            setCoordinateDescription('');
            loadClothingDetail(); // 목록 새로고침
        } catch (err) {
            setError('코디 사진 추가에 실패했습니다.');
            console.error('Failed to add coordinate:', err);
        }
    };

    const handleDeleteCoordinate = async (coordinateId: string) => {
        if (!clothing || !window.confirm('이 코디 사진을 삭제하시겠습니까?')) return;

        try {
            await dbService.deleteCoordinate(clothing.id, coordinateId);
            loadClothingDetail(); // 목록 새로고침
        } catch (err) {
            setError('코디 사진 삭제에 실패했습니다.');
            console.error('Failed to delete coordinate:', err);
        }
    };

    const getCategoryLabel = (categoryValue: string) => {
        const category = CATEGORIES.find(cat => cat.value === categoryValue);
        return category ? category.label : categoryValue;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !clothing) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error || '의류를 찾을 수 없습니다.'}
            </Alert>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    {getCategoryLabel(clothing.category)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setEditing(!editing)}
                    >
                        {editing ? '편집 취소' : '편집'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                    >
                        삭제
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                {/* 메인 이미지 */}
                <Card>
                    <CardMedia
                        component="img"
                        height="400"
                        image={clothing.imageUrl}
                        alt={getCategoryLabel(clothing.category)}
                        sx={{ objectFit: 'cover' }}
                    />
                </Card>

                {/* 상세 정보 */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            기본 정보
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            <Chip label={clothing.size} color="primary" />
                            <Chip label={clothing.color} variant="outlined" />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2">
                                <strong>구입일:</strong> {new Date(clothing.buyDate).toLocaleDateString('ko-KR')}
                            </Typography>
                            {clothing.shop && (
                                <Typography variant="body2">
                                    <strong>구입처:</strong> {clothing.shop}
                                </Typography>
                            )}
                            {clothing.material && (
                                <Typography variant="body2">
                                    <strong>소재:</strong> {clothing.material}
                                </Typography>
                            )}
                            {clothing.washing && (
                                <Typography variant="body2">
                                    <strong>세탁방법:</strong> {clothing.washing}
                                </Typography>
                            )}
                            <Typography variant="body2">
                                <strong>등록일:</strong> {new Date(clothing.createdAt).toLocaleDateString('ko-KR')}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* 코디 사진 */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            코디 사진 ({clothing.coordinates.length}개)
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCoordinateDialogOpen(true)}
                        >
                            코디 추가
                        </Button>
                    </Box>

                    {clothing.coordinates.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                아직 등록된 코디 사진이 없습니다.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                            {clothing.coordinates.map((coordinate) => (
                                <Paper key={coordinate.id} sx={{ position: 'relative' }}>
                                    <img
                                        src={coordinate.photoUrl}
                                        alt="Coordinate"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                        }}
                                        onClick={() => handleDeleteCoordinate(coordinate.id)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(coordinate.date).toLocaleDateString('ko-KR')}
                                        </Typography>
                                        {coordinate.description && (
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {coordinate.description}
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* 코디 추가 다이얼로그 */}
            <Dialog open={coordinateDialogOpen} onClose={() => setCoordinateDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>코디 사진 추가</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Paper
                            sx={{
                                p: 3,
                                border: '2px dashed #ccc',
                                textAlign: 'center',
                                cursor: 'pointer',
                                '&:hover': { borderColor: 'primary.main' }
                            }}
                            onClick={() => document.getElementById('coordinate-image-upload')?.click()}
                        >
                            {coordinateImage ? (
                                <Box>
                                    <img
                                        src={coordinateImage}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        클릭하여 다른 이미지 선택
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body1" gutterBottom>
                                        클릭하여 코디 사진 업로드
                                    </Typography>
                                </Box>
                            )}
                            <input
                                id="coordinate-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleCoordinateImageUpload}
                                style={{ display: 'none' }}
                            />
                        </Paper>

                        <TextField
                            fullWidth
                            label="설명 (선택사항)"
                            multiline
                            rows={3}
                            value={coordinateDescription}
                            onChange={(e) => setCoordinateDescription(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCoordinateDialogOpen(false)}>취소</Button>
                    <Button onClick={handleAddCoordinate} variant="contained" disabled={!coordinateImage}>
                        추가
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClothingDetail; 