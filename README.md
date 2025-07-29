# 👗 MyCloset - 개인 옷장 디지털 정리 웹앱

개인용 옷장을 디지털로 관리할 수 있는 PWA(Progressive Web App)입니다. 의류 등록, 코디 기록, 메타정보 관리 기능을 제공합니다.

## ✨ 주요 기능

### 🧥 의류 관리
- **의류 등록**: 사진 업로드, 카테고리 선택, 상세 정보 입력
- **카테고리별 조회**: 셔츠, 자켓, 니트 등 카테고리별 필터링
- **상세 정보**: 사이즈, 색상, 구입일, 소재, 세탁법 등 관리

### 👗 코디 관리
- **코디 사진 등록**: 특정 의상과 함께 착장 사진 추가
- **코디 갤러리**: 등록된 코디 사진들을 한눈에 확인
- **코디 설명**: 각 코디에 대한 메모 추가

### 📱 PWA 지원
- **모바일 최적화**: 반응형 디자인으로 모바일에서도 편리하게 사용
- **오프라인 지원**: 서비스 워커를 통한 오프라인 캐싱
- **홈 화면 추가**: 모바일 홈 화면에 앱 아이콘으로 추가 가능

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI)
- **Build Tool**: Vite
- **데이터 저장**: IndexedDB (브라우저 로컬 저장소)
- **PWA**: Service Worker + Web App Manifest

## 🚀 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📱 PWA 설치 방법

### Android Chrome
1. 브라우저에서 앱 접속
2. 주소창 옆 "설치" 버튼 클릭
3. 또는 메뉴 → "홈 화면에 추가" 선택

### iOS Safari
1. Safari에서 앱 접속
2. 공유 버튼 → "홈 화면에 추가" 선택
3. "추가" 버튼 클릭

## 🗂 프로젝트 구조

```
mycloset/
├── public/
│   ├── manifest.json      # PWA 매니페스트
│   ├── sw.js             # 서비스 워커
│   └── index.html        # 메인 HTML
├── src/
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   └── Header.tsx
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── ClothingList.tsx
│   │   ├── AddClothing.tsx
│   │   └── ClothingDetail.tsx
│   ├── types/           # TypeScript 타입 정의
│   │   └── index.ts
│   ├── utils/           # 유틸리티 함수
│   │   ├── database.ts
│   │   └── imageUtils.ts
│   ├── App.tsx          # 메인 앱 컴포넌트
│   └── main.ts          # 앱 진입점
└── package.json
```

## 📊 데이터 구조

### 의류 아이템 (ClothingItem)
```typescript
{
  id: string;
  category: string;        // 카테고리 (셔츠, 자켓 등)
  imageUrl: string;        // 이미지 URL (Base64)
  size: string;           // 사이즈 (S, M, L 등)
  color: string;          // 색상
  buyDate: string;        // 구입일
  shop: string;           // 구입처
  material: string;       // 소재
  washing: string;        // 세탁방법
  coordinates: Coordinate[]; // 코디 사진 배열
  createdAt: string;      // 등록일
  updatedAt: string;      // 수정일
}
```

### 코디 (Coordinate)
```typescript
{
  id: string;
  photoUrl: string;       // 코디 사진 URL
  date: string;          // 등록일
  description?: string;  // 설명 (선택사항)
}
```

## 🎨 UI/UX 특징

- **Material Design**: Google의 Material Design 가이드라인 적용
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 화면 크기 지원
- **직관적인 네비게이션**: 헤더와 플로팅 액션 버튼으로 쉬운 이동
- **이미지 최적화**: 자동 이미지 압축 및 Base64 변환
- **로딩 상태**: 사용자 경험을 위한 로딩 인디케이터

## 🔧 개발 가이드

### 새로운 카테고리 추가
`src/types/index.ts`의 `CATEGORIES` 배열에 추가:
```typescript
{ value: 'new-category', label: '새 카테고리' }
```

### 이미지 처리 커스터마이징
`src/utils/imageUtils.ts`에서 이미지 압축 설정 조정:
```typescript
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8)
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 GitHub Issues를 이용해주세요.

---

**MyCloset**으로 당신의 옷장을 더 스마트하게 관리해보세요! 🎉 