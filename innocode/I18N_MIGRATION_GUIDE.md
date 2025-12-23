# Hướng dẫn Migrate các trang còn lại sang i18n

## Các trang đã được migrate

✅ **Đã hoàn thành:**
- Navbar (với language switcher bên phải logo)
- Policy page
- Home page
- About page
- Login page
- Register page
- Unauthorized page
- NotFound page
- PageContainer (error messages)
- API Error translation system

## Các trang cần migrate

### Trang chính (Priority High)
- [ ] Contests (`src/features/contest/student/Contests.jsx`)
- [ ] ContestDetail (`src/features/contest/student/ContestDetail.jsx`)
- [ ] Leaderboard (`src/features/leaderboard/pages/student/Leaderboard.jsx`)
- [ ] Profile (`src/features/common/profile/pages/Profile.jsx`)
- [ ] Notifications (`src/features/common/pages/Notifications.jsx`)
- [ ] Team (`src/features/contest/student/Team.jsx`)

### Trang Organizer (Priority Medium)
- [ ] OrganizerContests (`src/features/contest/pages/organizer/OrganizerContests.jsx`)
- [ ] OrganizerContestDetail (`src/features/contest/pages/organizer/OrganizerContestDetail.jsx`)
- [ ] OrganizerLeaderboard (`src/features/leaderboard/pages/organizer/OrganizerLeaderboard.jsx`)
- [ ] OrganizerTeams (`src/features/team/pages/organizer/OrganizerTeams.jsx`)

### Trang khác (Priority Low)
- [ ] Practice pages
- [ ] MCQ pages
- [ ] Certificate pages
- [ ] Appeal pages
- [ ] School pages
- [ ] Province pages

## Cách migrate một trang

### Bước 1: Import useTranslation

```javascript
import { useTranslation } from 'react-i18next'
```

### Bước 2: Sử dụng trong component

```javascript
const MyComponent = () => {
  const { t } = useTranslation('common') // hoặc namespace khác
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <button>{t('buttons.save')}</button>
    </div>
  )
}
```

### Bước 3: Thêm translations vào file JSON

**Thêm vào `src/locales/en/[namespace].json`:**
```json
{
  "title": "My Title",
  "description": "My Description"
}
```

**Thêm vào `src/locales/vi/[namespace].json`:**
```json
{
  "title": "Tiêu đề của tôi",
  "description": "Mô tả của tôi"
}
```

### Bước 4: Đăng ký namespace trong i18n config

Thêm vào `src/i18n/config.js`:
```javascript
import enMyNamespace from '../locales/en/mynamespace.json'
import viMyNamespace from '../locales/vi/mynamespace.json'

// Trong resources:
en: {
  // ...
  mynamespace: enMyNamespace,
},
vi: {
  // ...
  mynamespace: viMyNamespace,
}
```

## Best Practices

1. **Sử dụng namespace phù hợp**: 
   - `common` cho các text dùng chung
   - `pages` cho các trang đơn giản
   - Tên feature cho các trang phức tạp (ví dụ: `contests`, `leaderboard`)

2. **Tổ chức translations theo cấu trúc logic**:
```json
{
  "contests": {
    "title": "Contests",
    "filters": {
      "status": "Status",
      "search": "Search"
    },
    "actions": {
      "create": "Create Contest",
      "edit": "Edit"
    }
  }
}
```

3. **Sử dụng translateApiError cho tất cả API errors**:
```javascript
import translateApiError from '@/shared/utils/translateApiError'

try {
  // API call
} catch (error) {
  const translatedError = translateApiError(error, 'errors')
  toast.error(translatedError)
}
```

4. **Reuse translations**: Sử dụng `common.json` cho các text dùng chung như buttons, labels, etc.

## Checklist khi migrate

- [ ] Import `useTranslation`
- [ ] Thay thế tất cả hardcoded strings bằng `t()`
- [ ] Tạo translation files (en và vi)
- [ ] Đăng ký namespace trong i18n config
- [ ] Test với cả 2 ngôn ngữ
- [ ] Kiểm tra API error messages (sử dụng translateApiError)
- [ ] Kiểm tra validation messages
- [ ] Kiểm tra toast notifications

## Ví dụ hoàn chỉnh

**Component:**
```javascript
import { useTranslation } from 'react-i18next'
import translateApiError from '@/shared/utils/translateApiError'

const MyPage = () => {
  const { t } = useTranslation('mypage')
  
  const handleSubmit = async () => {
    try {
      // API call
    } catch (error) {
      const translatedError = translateApiError(error, 'errors')
      toast.error(translatedError)
    }
  }
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('buttons.submit')}</button>
    </div>
  )
}
```

**Translation files:**
- `src/locales/en/mypage.json`
- `src/locales/vi/mypage.json`

