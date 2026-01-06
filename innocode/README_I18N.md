# Hướng dẫn sử dụng i18n cho API Error Messages

## Tổng quan

Hệ thống đã được tích hợp i18n để xử lý các error messages từ API. Tất cả các error messages từ backend (thường bằng tiếng Anh) sẽ được tự động dịch sang ngôn ngữ hiện tại của user.

## Cách sử dụng

### 1. Sử dụng `translateApiError` utility

```javascript
import translateApiError from "@/shared/utils/translateApiError"

try {
  // API call
} catch (error) {
  const translatedError = translateApiError(error, "errors")
  toast.error(translatedError)
  // hoặc
  setError(translatedError)
}
```

### 2. Sử dụng `useApiError` hook (trong React components)

```javascript
import { useApiError } from "@/shared/hooks/useApiError"

const MyComponent = () => {
  const { translateError } = useApiError()

  try {
    // API call
  } catch (error) {
    const translatedError = translateError(error)
    toast.error(translatedError)
  }
}
```

### 3. Error handlers đã được tích hợp

Các error handlers sau đã tự động sử dụng translation:

- `handleThunkError` - Dùng cho Redux thunks
- `handleContestApiError` - Dùng cho contest errors

## Cách hoạt động

1. **Error Code Mapping**: Nếu API trả về error code (như `DUPLICATE`, `NOT_FOUND`), hệ thống sẽ map sang translation key tương ứng.

2. **Status Code Mapping**: Nếu không có error code, hệ thống sẽ dựa vào HTTP status code (401, 403, 404, 500, etc.)

3. **Message Pattern Matching**: Nếu không có code, hệ thống sẽ tìm pattern trong error message để match với translations.

4. **Fallback**: Nếu không tìm thấy translation, hệ thống sẽ trả về message gốc từ API (cho phép backend gửi pre-translated messages nếu cần).

## Thêm translations mới

### Thêm error code mới

1. Thêm vào `src/locales/en/errors.json`:

```json
{
  "myFeature": {
    "myErrorCode": "My error message in English"
  }
}
```

2. Thêm vào `src/locales/vi/errors.json`:

```json
{
  "myFeature": {
    "myErrorCode": "Thông báo lỗi bằng tiếng Việt"
  }
}
```

3. Thêm mapping vào `src/shared/utils/translateApiError.js`:

```javascript
const codeMap = {
  // ...
  MY_ERROR_CODE: "errors:myFeature.myErrorCode",
}
```

### Thêm message pattern mới

Thêm vào `matchCommonMessage` function trong `translateApiError.js`:

```javascript
{
  pattern: /my error pattern/i,
  translation: 'errors:myFeature.myErrorCode',
}
```

## Accept-Language Header

Hệ thống tự động gửi `Accept-Language` header trong mỗi API request dựa trên ngôn ngữ hiện tại của user. Nếu backend hỗ trợ, nó có thể trả về error messages đã được dịch sẵn.

## Best Practices

1. **Luôn sử dụng translateApiError** cho tất cả API errors
2. **Thêm error codes mới** vào translations thay vì hardcode messages
3. **Sử dụng error codes** thay vì error messages khi có thể (backend nên trả về error codes)
4. **Test với cả 2 ngôn ngữ** để đảm bảo translations hoạt động đúng

## Ví dụ

```javascript
// ❌ Không nên
catch (error) {
  toast.error(error.response.data.errorMessage)
}

// ✅ Nên làm
catch (error) {
  const translatedError = translateApiError(error, 'errors')
  toast.error(translatedError)
}
```
