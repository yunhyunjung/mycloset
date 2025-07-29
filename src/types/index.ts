export interface ClothingItem {
    id: string;
    category: string;
    imageUrl: string;
    size: string;
    color: string;
    buyDate: string;
    shop: string;
    material: string;
    washing: string;
    coordinates: Coordinate[];
    createdAt: string;
    updatedAt: string;
}

export interface Coordinate {
    id: string;
    photoUrl: string;
    date: string;
    description?: string;
}

export interface Category {
    value: string;
    label: string;
}

export const CATEGORIES: Category[] = [
    { value: 'shirts', label: '셔츠' },
    { value: 'jackets', label: '자켓' },
    { value: 'knits', label: '니트' },
    { value: 'pants', label: '바지' },
    { value: 'skirts', label: '치마' },
    { value: 'dresses', label: '원피스' },
    { value: 'shoes', label: '신발' },
    { value: 'accessories', label: '액세서리' },
    { value: 'outerwear', label: '아우터' },
    { value: 'underwear', label: '속옷' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const COLORS = ['화이트', '블랙', '그레이', '네이비', '브라운', '베이지', '레드', '블루', '그린', '옐로우', '핑크', '퍼플'];
export const MATERIALS = ['면', '울', '폴리에스터', '레이온', '데님', '가죽', '실크', '린넨', '니트'];
export const WASHING_METHODS = ['드라이클리닝', '손세탁', '기계세탁', '물세탁 금지']; 