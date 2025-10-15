# Pages Structure - InnoCode

Cấu trúc thư mục pages được tổ chức theo role để dễ dàng quản lý và phát triển.

## 📁 Cấu trúc thư mục

### 1. `/common` - Pages chung cho tất cả roles
Chứa các pages mà nhiều roles đều sử dụng:
- `Home.jsx` - Trang chủ
- `Profile.jsx` - Trang profile người dùng
- `Dashboard.jsx` - Trang dashboard (dùng cho judge, admin)
- `Announcements.jsx` - Trang thông báo
- `About.jsx` - Trang giới thiệu

**Roles sử dụng:** Tất cả roles

---

### 2. `/student` - Pages dành cho Student
Chứa các pages chỉ student sử dụng:
- `Contests.jsx` - Danh sách cuộc thi
- `ContestDetail.jsx` - Chi tiết cuộc thi
- `ContestProcessing.jsx` - Trang làm bài thi
- `Practice.jsx` - Trang luyện tập
- `Team.jsx` - Quản lý team
- `Leaderboard.jsx` - Bảng xếp hạng
- `Help.jsx` - Trang trợ giúp

**Roles sử dụng:** Student, Judge (một số pages như Contests)

---

### 3. `/organizer` - Pages dành cho Organizer
Chứa các pages quản lý cuộc thi:
- `OrganizerContests.jsx` - Quản lý cuộc thi của organizer

**Roles sử dụng:** Organizer

---

### 4. `/judge` - Pages dành cho Judge
Thư mục dành riêng cho Judge role (hiện tại chưa có pages riêng).

**Roles sử dụng:** Judge

---

### 5. `/admin` - Pages dành cho Admin
Thư mục dành riêng cho Admin role (hiện tại chưa có pages riêng).

**Roles sử dụng:** Admin

---

## 🔑 Roles trong hệ thống

### Student
- **Menu items:** Profile, Contests, Practice, Team, Leaderboard, Announcements, Certificate, Help
- **Pages:** Tất cả pages trong `/common` và `/student`

### Organizer
- **Menu items:** Profile, Contests (Organizer version)
- **Pages:** `/common/Profile.jsx`, `/organizer/OrganizerContests.jsx`

### Judge
- **Menu items:** Profile, Dashboard, Contests, Announcements
- **Pages:** `/common` và một số pages từ `/student`

### Admin
- **Menu items:** Profile, Dashboard, Leaderboard, Announcements, Help
- **Pages:** `/common` và một số pages từ `/student`

---

## 📝 Quy tắc đặt tên và tổ chức

1. **Common pages**: Đặt trong `/common` nếu được sử dụng bởi 2+ roles
2. **Role-specific pages**: Đặt trong folder role tương ứng
3. **Naming convention**: PascalCase cho tên file (VD: `ContestDetail.jsx`)
4. **Import path**: Luôn import từ đường dẫn đầy đủ (VD: `./pages/student/Contests`)

---

## 🔄 Cập nhật sau khi thêm page mới

Khi thêm page mới:
1. Xác định role sẽ sử dụng page
2. Đặt file vào folder phù hợp
3. **Quan trọng:** Sử dụng `../../` thay vì `../` khi import từ components, config, data
   - Ví dụ: `import PageContainer from '../../components/PageContainer'`
   - Ví dụ: `import { BREADCRUMBS } from '../../config/breadcrumbs'`
4. Cập nhật import trong `main.jsx`
5. Cập nhật menu trong `components/sidebar/Sidebar.jsx` nếu cần
6. Cập nhật breadcrumbs trong `config/breadcrumbs.js` nếu cần

---

## 📚 Tham khảo

- **Router config:** `src/main.jsx`
- **Sidebar menu:** `src/components/sidebar/Sidebar.jsx`
- **Breadcrumbs:** `src/config/breadcrumbs.js`

