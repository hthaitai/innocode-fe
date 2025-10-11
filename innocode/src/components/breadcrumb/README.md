# Breadcrumb Component

## Mô tả
Component BreadcrumbTitle hiển thị breadcrumb với icon chevron giữa các mục, giúp người dùng hiểu vị trí hiện tại trong ứng dụng.

## Cách sử dụng

### 1. Import component
```javascript
import { BreadcrumbTitle } from '../components/breadcrumb';
```

### 2. Sử dụng cơ bản
```javascript
<BreadcrumbTitle items={['Home', 'Contests', 'Contest Detail']} />
```

### 3. Sử dụng với PageContainer
```javascript
<PageContainer breadcrumb={['Home', 'Contests', 'Contest Detail']}>
  {/* Nội dung trang */}
</PageContainer>
```

### 4. Sử dụng với cấu hình breadcrumb
```javascript
import { BREADCRUMBS, createBreadcrumb } from '../config/breadcrumbs';

// Breadcrumb tĩnh
<PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>

// Breadcrumb động
<PageContainer breadcrumb={createBreadcrumb('CONTEST_DETAIL', 'Python Challenge')}>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| items | Array | No | Mảng các mục breadcrumb |

## Ví dụ

### Breadcrumb đơn giản
```javascript
<BreadcrumbTitle items={['Home']} />
// Kết quả: Home
```

### Breadcrumb nhiều cấp
```javascript
<BreadcrumbTitle items={['Home', 'Contests', 'Python Challenge']} />
// Kết quả: Home → Contests → Python Challenge
```

### Breadcrumb với PageContainer
```javascript
<PageContainer breadcrumb={['Profile', 'Personal Information']}>
  <div>Nội dung trang profile</div>
</PageContainer>
```

## Styling
- Mục cuối cùng có màu cam (text-orange-600)
- Icon chevron có màu xám (text-gray-600)
- Font size: 3xl, font weight: bold
- Khoảng cách giữa các mục: gap-2

## Lưu ý
- Component tự động ẩn nếu items rỗng
- Icon chevron chỉ hiển thị giữa các mục (không hiển thị trước mục đầu tiên)
- Mục cuối cùng được highlight với màu cam
