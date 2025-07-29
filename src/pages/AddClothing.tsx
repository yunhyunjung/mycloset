import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Paper,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Check as CheckIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SelectChangeEvent } from '@mui/material';
import { CATEGORIES, SIZES, COLORS, MATERIALS, WASHING_METHODS } from '../types';
import { dbService } from '../utils/database';
import { convertImageToBase64, compressImage, validateImageFile } from '../utils/imageUtils';

const steps = ['사진 업로드', '기본 정보', '추가 정보'];

const AddClothing: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const [formData, setFormData] = useState({
        category: '',
        size: '',
        color: '',
        buyDate: '',
        shop: '',
        material: '',
        washing: '',
        imageUrl: ''
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            validateImageFile(file);
            const compressedFile = await compressImage(file);
            const base64 = await convertImageToBase64(compressedFile);

            setFormData(prev => ({ ...prev, imageUrl: base64 }));
            setImagePreview(base64);
            setError(null);
            setActiveStep(1);
        } catch (err) {
            setError(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.imageUrl) {
            setError('이미지를 업로드해주세요.');
            return;
        }

        if (!formData.category || !formData.size || !formData.color || !formData.buyDate) {
            setError('필수 항목을 모두 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await dbService.addClothing({
                ...formData,
                coordinates: []
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError('의류 등록에 실패했습니다.');
            console.error('Failed to add clothing:', err);
        } finally {
            setLoading(false);
        }
    };

    const isStepValid = (step: number) => {
        switch (step) {
            case 0:
                return !!formData.imageUrl;
            case 1:
                return !!formData.category && !!formData.size && !!formData.color && !!formData.buyDate;
            case 2:
                return true;
            default:
                return false;
        }
    };

    return (
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    color: '#2c3e50',
                    fontWeight: 700,
                    mb: 4,
                    mt: 2,
                }}
            >
                새로운 옷 추가
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    의류가 성공적으로 등록되었습니다! 잠시 후 목록으로 이동합니다.
                </Alert>
            )}

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #e0e0e0',
                    borderRadius: 4,
                    mb: 4,
                    maxWidth: 800,
                    mx: 'auto',
                }}
            >
                <Stepper
                    activeStep={activeStep}
                    sx={{
                        mb: 4,
                        '& .MuiStepLabel-label': {
                            fontSize: { xs: '0.875rem', md: '1rem' },
                        }
                    }}
                >
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel
                                sx={{
                                    '& .MuiStepLabel-iconContainer': {
                                        '& .MuiStepIcon-root': {
                                            color: index <= activeStep ? 'primary.main' : 'grey.400',
                                        },
                                    },
                                }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Card
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #e0e0e0',
                    borderRadius: 4,
                    maxWidth: 800,
                    mx: 'auto',
                }}
            >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* 이미지 업로드 */}
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, color: '#2c3e50' }}>
                                📸 옷 사진
                            </Typography>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    border: '2px dashed',
                                    borderColor: imagePreview ? 'success.main' : '#2c3e50',
                                    borderRadius: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease-in-out',
                                    background: imagePreview ? 'rgba(76, 175, 80, 0.05)' : 'rgba(44, 62, 80, 0.05)',
                                    '&:hover': {
                                        borderColor: '#34495e',
                                        transform: 'scale(1.02)',
                                    }
                                }}
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                {imagePreview ? (
                                    <Box>
                                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '300px',
                                                    objectFit: 'contain',
                                                    borderRadius: 8,
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: -8,
                                                    right: -8,
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    background: 'success.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                <CheckIcon fontSize="small" />
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                            클릭하여 다른 이미지 선택
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Box
                                            sx={{
                                                width: { xs: 60, md: 80 },
                                                height: { xs: 60, md: 80 },
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2,
                                            }}
                                        >
                                            <CloudUploadIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} />
                                        </Box>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                            클릭하여 이미지 업로드
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            JPEG, PNG, WebP 파일 (최대 10MB)
                                        </Typography>
                                    </Box>
                                )}
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </Paper>
                        </Box>

                        {/* 기본 정보 */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>카테고리 *</InputLabel>
                                <Select
                                    value={formData.category}
                                    label="카테고리 *"
                                    onChange={(e: SelectChangeEvent) => handleInputChange('category', e.target.value)}
                                    required
                                    sx={{ borderRadius: 2 }}
                                >
                                    {CATEGORIES.map((category) => (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>사이즈 *</InputLabel>
                                <Select
                                    value={formData.size}
                                    label="사이즈 *"
                                    onChange={(e: SelectChangeEvent) => handleInputChange('size', e.target.value)}
                                    required
                                    sx={{ borderRadius: 2 }}
                                >
                                    {SIZES.map((size) => (
                                        <MenuItem key={size} value={size}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>색상 *</InputLabel>
                                <Select
                                    value={formData.color}
                                    label="색상 *"
                                    onChange={(e: SelectChangeEvent) => handleInputChange('color', e.target.value)}
                                    required
                                    sx={{ borderRadius: 2 }}
                                >
                                    {COLORS.map((color) => (
                                        <MenuItem key={color} value={color}>
                                            {color}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="구입일 *"
                                type="date"
                                value={formData.buyDate}
                                onChange={(e) => handleInputChange('buyDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required
                                sx={{ borderRadius: 2 }}
                            />
                        </Box>

                        {/* 추가 정보 */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                            <TextField
                                fullWidth
                                label="구입처"
                                value={formData.shop}
                                onChange={(e) => handleInputChange('shop', e.target.value)}
                                sx={{ borderRadius: 2 }}
                            />

                            <FormControl fullWidth>
                                <InputLabel>소재</InputLabel>
                                <Select
                                    value={formData.material}
                                    label="소재"
                                    onChange={(e: SelectChangeEvent) => handleInputChange('material', e.target.value)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    {MATERIALS.map((material) => (
                                        <MenuItem key={material} value={material}>
                                            {material}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>세탁방법</InputLabel>
                                <Select
                                    value={formData.washing}
                                    label="세탁방법"
                                    onChange={(e: SelectChangeEvent) => handleInputChange('washing', e.target.value)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    {WASHING_METHODS.map((method) => (
                                        <MenuItem key={method} value={method}>
                                            {method}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* 버튼 */}
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'flex-end',
                            pt: 2,
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/')}
                                disabled={loading}
                                sx={{ borderRadius: 3, px: 4 }}
                                fullWidth={false}
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || !isStepValid(2)}
                                startIcon={loading ? <CircularProgress size={20} /> : null}
                                sx={{ borderRadius: 3, px: 4 }}
                                fullWidth={false}
                            >
                                {loading ? '등록 중...' : '등록하기'}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AddClothing; 