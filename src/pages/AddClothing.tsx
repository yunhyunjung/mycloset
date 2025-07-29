import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Alert,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Check as CheckIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SelectChangeEvent } from '@mui/material';
import type { ClothingItem } from '../types';
import { CATEGORIES, SIZES, COLORS, MATERIALS, WASHING_METHODS } from '../types';
import { dbService } from '../utils/database';
import { convertImageToBase64, compressImage, validateImageFile } from '../utils/imageUtils';

const steps = ['이미지 업로드', '기본 정보', '상세 정보'];

const AddClothing: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState({
        category: '',
        size: '',
        color: '',
        buyDate: '',
        shop: '',
        material: '',
        washing: '',
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            if (!validateImageFile(file)) {
                setError('유효한 이미지 파일을 선택해주세요 (JPG, PNG, 최대 5MB)');
                return;
            }

            const compressedFile = await compressImage(file);
            const base64 = await convertImageToBase64(compressedFile);

            setImageFile(compressedFile);
            setImagePreview(base64);
            setError('');
            setSuccess('이미지가 성공적으로 업로드되었습니다!');
        } catch (err) {
            setError('이미지 처리 중 오류가 발생했습니다.');
            console.error('Image processing error:', err);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (activeStep === 0 && !imageFile) {
            setError('이미지를 업로드해주세요.');
            return;
        }
        if (activeStep === 1 && (!formData.category || !formData.size || !formData.color)) {
            setError('필수 정보를 모두 입력해주세요.');
            return;
        }

        setError('');
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setError('');
    };

    const handleSubmit = async () => {
        if (!imageFile) {
            setError('이미지를 업로드해주세요.');
            return;
        }

        try {
            const base64 = await convertImageToBase64(imageFile);
            const newClothing: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'> = {
                category: formData.category,
                imageUrl: base64,
                size: formData.size,
                color: formData.color,
                buyDate: formData.buyDate,
                shop: formData.shop,
                material: formData.material,
                washing: formData.washing,
                coordinates: [],
            };

            await dbService.addClothing(newClothing);
            setSuccess('옷이 성공적으로 추가되었습니다!');

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            setError('옷 추가 중 오류가 발생했습니다.');
            console.error('Add clothing error:', err);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ textAlign: 'center' }}>
                        <Paper
                            sx={{
                                p: { xs: 2, sm: 3, md: 4 },
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 3,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                borderColor: imageFile ? '#4caf50' : '#e0e0e0',
                                '&:hover': {
                                    borderColor: imageFile ? '#4caf50' : '#2c3e50',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                            onClick={() => document.getElementById('image-upload')?.click()}
                        >
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            {imagePreview ? (
                                <Box sx={{ position: 'relative' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            maxHeight: isSmallMobile ? 200 : isMobile ? 300 : 400,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                        }}
                                    />
                                    <CheckIcon
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            color: '#4caf50',
                                            fontSize: { xs: '1.5rem', sm: '2rem' },
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            padding: 0.5,
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
                                    <CloudUploadIcon
                                        sx={{
                                            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                                            color: 'text.secondary',
                                            mb: 2,
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 1,
                                            fontSize: { xs: '1rem', sm: '1.125rem' },
                                        }}
                                    >
                                        이미지를 업로드하세요
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        }}
                                    >
                                        JPG, PNG 파일 (최대 5MB)
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                        <FormControl fullWidth size={isSmallMobile ? 'small' : 'medium'}>
                            <InputLabel
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    color: 'text.secondary'
                                }}
                            >
                                카테고리 *
                            </InputLabel>
                            <Select
                                value={formData.category}
                                label="카테고리 *"
                                onChange={(e: SelectChangeEvent) => handleInputChange('category', e.target.value)}
                                sx={{
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    '& .MuiSelect-select': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    },
                                }}
                            >
                                {CATEGORIES.map((category) => (
                                    <MenuItem key={category.value} value={category.value}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size={isSmallMobile ? 'small' : 'medium'}>
                            <InputLabel
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    color: 'text.secondary'
                                }}
                            >
                                사이즈 *
                            </InputLabel>
                            <Select
                                value={formData.size}
                                label="사이즈 *"
                                onChange={(e: SelectChangeEvent) => handleInputChange('size', e.target.value)}
                                sx={{
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    '& .MuiSelect-select': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    },
                                }}
                            >
                                {SIZES.map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size={isSmallMobile ? 'small' : 'medium'}>
                            <InputLabel
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    color: 'text.secondary'
                                }}
                            >
                                색상 *
                            </InputLabel>
                            <Select
                                value={formData.color}
                                label="색상 *"
                                onChange={(e: SelectChangeEvent) => handleInputChange('color', e.target.value)}
                                sx={{
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    '& .MuiSelect-select': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    },
                                }}
                            >
                                {COLORS.map((color) => (
                                    <MenuItem key={color} value={color}>
                                        {color}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                        <TextField
                            label="구입일"
                            type="date"
                            value={formData.buyDate}
                            onChange={(e) => handleInputChange('buyDate', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                                sx: {
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    color: 'text.secondary'
                                },
                            }}
                            inputProps={{
                                sx: {
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                },
                            }}
                            size={isSmallMobile ? 'small' : 'medium'}
                        />

                        <TextField
                            label="구입처"
                            value={formData.shop}
                            onChange={(e) => handleInputChange('shop', e.target.value)}
                            InputLabelProps={{
                                sx: {
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    color: 'text.secondary'
                                },
                            }}
                            inputProps={{
                                sx: {
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                },
                            }}
                            size={isSmallMobile ? 'small' : 'medium'}
                        />

                        <FormControl fullWidth size={isSmallMobile ? 'small' : 'medium'}>
                            <InputLabel
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    color: 'text.secondary'
                                }}
                            >
                                소재
                            </InputLabel>
                            <Select
                                value={formData.material}
                                label="소재"
                                onChange={(e: SelectChangeEvent) => handleInputChange('material', e.target.value)}
                                sx={{
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    '& .MuiSelect-select': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    },
                                }}
                            >
                                {MATERIALS.map((material) => (
                                    <MenuItem key={material} value={material}>
                                        {material}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size={isSmallMobile ? 'small' : 'medium'}>
                            <InputLabel
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    color: 'text.secondary'
                                }}
                            >
                                세탁 방법
                            </InputLabel>
                            <Select
                                value={formData.washing}
                                label="세탁 방법"
                                onChange={(e: SelectChangeEvent) => handleInputChange('washing', e.target.value)}
                                sx={{
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    '& .MuiSelect-select': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    },
                                }}
                            >
                                {WASHING_METHODS.map((method) => (
                                    <MenuItem key={method} value={method}>
                                        {method}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* 헤더 */}
            <Typography
                variant="h4"
                sx={{
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    mb: { xs: 2, sm: 3, md: 4 },
                    textAlign: { xs: 'center', sm: 'left' },
                }}
            >
                새로운 옷 추가
            </Typography>

            {/* 알림 메시지 */}
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
            {success && (
                <Alert
                    severity="success"
                    sx={{
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                >
                    {success}
                </Alert>
            )}

            {/* 스텝퍼 */}
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
                <Stepper
                    activeStep={activeStep}
                    sx={{
                        mb: { xs: 3, sm: 4 },
                        '& .MuiStepLabel-label': {
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        },
                    }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* 스텝 콘텐츠 */}
                <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                    {renderStepContent(activeStep)}
                </Box>

                {/* 네비게이션 버튼 */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: { xs: 1, sm: 2 },
                    }}
                >
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                    >
                        이전
                    </Button>
                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    px: { xs: 2, sm: 3 },
                                    py: { xs: 1, sm: 1.5 },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                }}
                            >
                                완료
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{
                                    px: { xs: 2, sm: 3 },
                                    py: { xs: 1, sm: 1.5 },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                }}
                            >
                                다음
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddClothing; 