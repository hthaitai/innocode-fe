# Breadcrumb Configuration

## Mô tả
File cấu hình breadcrumb cho toàn bộ dự án, cung cấp các breadcrumb có sẵn và helper function để tạo breadcrumb động.

## Cách sử dụng

### 1. Import cấu hình
```javascript
import { BREADCRUMBS, createBreadcrumb } from '../config/breadcrumbs';
```

### 2. Sử dụng breadcrumb tĩnh
```javascript
<PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
  {/* Nội dung trang */}
</PageContainer>
```

### 3. Sử dụng breadcrumb động
```javascript
// Với tham số
<PageContainer breadcrumb={createBreadcrumb('CONTEST_DETAIL', 'Python Challenge')}>

// Kết quả: Contests → Python Challenge
```

## Các breadcrumb có sẵn

### Trang chính
- `HOME`: ['Home']
- `CONTESTS`: ['Contests']
- `PRACTICE`: ['Practice']
- `TEAM`: ['Team']
- `LEADERBOARD`: ['Leaderboard']
- `ANNOUNCEMENTS`: ['Announcements']
- `HELP`: ['Help']
- `PROFILE`: ['Profile']
- `DASHBOARD`: ['Dashboard']
- `ABOUT`: ['About']

### Trang con
- `PROFILE_ABOUT`: ['Profile', 'Personal Information']
- `PROFILE_PASSWORD`: ['Profile', 'Change Password']
- `CONTEST_CREATE`: ['Contests', 'Create Contest']
- `TEAM_CREATE`: ['Team', 'Create Team']

### Trang admin
- `ADMIN_DASHBOARD`: ['Admin', 'Dashboard']
- `ADMIN_CONTESTS`: ['Admin', 'Contests']
- `ADMIN_USERS`: ['Admin', 'Users']
- `ADMIN_TEAMS`: ['Admin', 'Teams']
- `ADMIN_ANNOUNCEMENTS`: ['Admin', 'Announcements']

### Trang lỗi
- `NOT_FOUND`: ['Not Found']
- `UNAUTHORIZED`: ['Unauthorized']

## Breadcrumb động

### Contest Detail
```javascript
createBreadcrumb('CONTEST_DETAIL', 'Python Challenge')
// Kết quả: ['Contests', 'Python Challenge']
```

### Contest Edit
```javascript
createBreadcrumb('CONTEST_EDIT', 'Python Challenge')
// Kết quả: ['Contests', 'Python Challenge', 'Edit']
```

### Team Detail
```javascript
createBreadcrumb('TEAM_DETAIL', 'Team Alpha')
// Kết quả: ['Team', 'Team Alpha']
```

## Thêm breadcrumb mới

### 1. Thêm vào BREADCRUMBS
```javascript
export const BREADCRUMBS = {
  // ... existing breadcrumbs
  NEW_PAGE: ['New Page'],
  NEW_DYNAMIC: (param) => ['Parent', param],
};
```

### 2. Sử dụng
```javascript
// Tĩnh
<PageContainer breadcrumb={BREADCRUMBS.NEW_PAGE}>

// Động
<PageContainer breadcrumb={createBreadcrumb('NEW_DYNAMIC', 'Value')}>
```

## Ví dụ thực tế

### Trang Contests
```javascript
<PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
  {/* Danh sách contests */}
</PageContainer>
```

### Trang Contest Detail
```javascript
const contest = { title: 'Python Challenge' };
<PageContainer breadcrumb={createBreadcrumb('CONTEST_DETAIL', contest.title)}>
  {/* Chi tiết contest */}
</PageContainer>
```

### Trang Profile About
```javascript
<PageContainer breadcrumb={BREADCRUMBS.PROFILE_ABOUT}>
  {/* Thông tin cá nhân */}
</PageContainer>
```

## Lưu ý
- Tất cả breadcrumb đều sử dụng tiếng Anh
- Breadcrumb động sử dụng function để nhận tham số
- Helper function `createBreadcrumb` tự động xử lý breadcrumb động
- Fallback về 'Home' nếu không tìm thấy breadcrumb
