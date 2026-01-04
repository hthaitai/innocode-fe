// Helper function to translate breadcrumb items
// This allows gradual migration to i18n without breaking existing code

export const translateBreadcrumb = (breadcrumbArray, language = "en") => {
  if (!breadcrumbArray || !Array.isArray(breadcrumbArray)) {
    return breadcrumbArray
  }

  // Translation mapping
  const translations = {
    // Main pages
    Home: { vi: "Trang chủ", en: "Home" },
    Contests: { vi: "Cuộc thi", en: "Contests" },
    "Your Contests": { vi: "Cuộc thi của bạn", en: "Your Contests" },
    Provinces: { vi: "Tỉnh/Thành phố", en: "Provinces" },
    Schools: { vi: "Trường học", en: "Schools" },
    Notifications: { vi: "Thông báo", en: "Notifications" },
    Practice: { vi: "Luyện tập", en: "Practice" },
    Team: { vi: "Đội", en: "Team" },
    Leaderboard: { vi: "Bảng xếp hạng", en: "Leaderboard" },
    Announcements: { vi: "Thông báo", en: "Announcements" },
    Help: { vi: "Trợ giúp", en: "Help" },
    Profile: { vi: "Hồ sơ", en: "Profile" },
    Dashboard: { vi: "Bảng điều khiển", en: "Dashboard" },
    About: { vi: "Giới thiệu", en: "About" },
    Appeal: { vi: "Khiếu nại", en: "Appeal" },
    "Student Certificate": {
      vi: "Chứng chỉ học sinh",
      en: "Student Certificate",
    },
    "School Management": { vi: "Quản lý trường học", en: "School Management" },
    "My School Management": {
      vi: "Trường học của tôi",
      en: "My School Management",
    },
    "My Managed Schools": {
      vi: "Quản lý trường học",
      en: "My Managed Schools",
    },
    "Create Request": { vi: "Tạo yêu cầu", en: "Create Request" },
    "School Requests": { vi: "Yêu cầu tạo trường", en: "School Requests" },
    Request: { vi: "Yêu cầu", en: "Request" },

    // Sub-pages
    "Personal Information": {
      vi: "Thông tin cá nhân",
      en: "Personal Information",
    },
    "Change Password": { vi: "Đổi mật khẩu", en: "Change Password" },
    "Create Contest": { vi: "Tạo cuộc thi", en: "Create Contest" },
    Edit: { vi: "Chỉnh sửa", en: "Edit" },
    "Create Team": { vi: "Tạo đội", en: "Create Team" },
    "Policy and Rules": {
      vi: "Chính sách và Quy định",
      en: "Policy and Rules",
    },
    Processing: { vi: "Đang xử lý", en: "Processing" },
    Results: { vi: "Kết quả", en: "Results" },
    Submissions: { vi: "Bài nộp", en: "Submissions" },

    // Admin
    Admin: { vi: "Quản trị", en: "Admin" },
    Users: { vi: "Người dùng", en: "Users" },
    Teams: { vi: "Đội thi", en: "Teams" },

    // Organizer
    "New contest": { vi: "Cuộc thi mới", en: "New contest" },
    "Edit contest": { vi: "Chỉnh sửa cuộc thi", en: "Edit contest" },
    Judges: { vi: "Ban giám khảo", en: "Judges" },
    "Active Judges": { vi: "Giám khảo hoạt động", en: "Active Judges" },
    "Judge Invites": { vi: "Lời mời giám khảo", en: "Judge Invites" },
    "New round": { vi: "Vòng thi mới", en: "New round" },
    "Edit round": { vi: "Chỉnh sửa vòng thi", en: "Edit round" },
    Questions: { vi: "Câu hỏi", en: "Questions" },
    "New questions": { vi: "Câu hỏi mới", en: "New questions" },
    "Quiz attempts": { vi: "Lượt làm bài", en: "Quiz attempts" },
    "Rubric editor": { vi: "Biên tập rubric", en: "Rubric editor" },
    "Manual results": { vi: "Kết quả thủ công", en: "Manual results" },
    "Test cases": { vi: "Test cases", en: "Test cases" },
    "New test case": { vi: "Test case mới", en: "New test case" },
    "Edit test case": { vi: "Chỉnh sửa test case", en: "Edit test case" },
    "Auto results": { vi: "Kết quả tự động", en: "Auto results" },

    // Certificates
    "Certificate templates": {
      vi: "Mẫu chứng chỉ",
      en: "Certificate templates",
    },
    "Issued certificates": {
      vi: "Chứng chỉ đã cấp",
      en: "Issued certificates",
    },
    "Issued student certificates": {
      vi: "Chứng chỉ cá nhân đã cấp",
      en: "Issued student certificates",
    },
    "Issued team certificates": {
      vi: "Chứng chỉ đội đã cấp",
      en: "Issued team certificates",
    },
    Certificates: { vi: "Chứng chỉ", en: "Certificates" },
    "New Template": { vi: "Mẫu mới", en: "New Template" },

    // Appeals & Others
    Appeals: { vi: "Khiếu nại", en: "Appeals" },
    Plagiarism: { vi: "Đạo văn", en: "Plagiarism" },
    "Activity Logs": { vi: "Nhật ký hoạt động", en: "Activity Logs" },
    Evaluation: { vi: "Đánh giá", en: "Evaluation" },
    "Role Registrations": { vi: "Đăng ký vai trò", en: "Role Registrations" },

    // Error pages
    "Not Found": { vi: "Không tìm thấy", en: "Not Found" },
    Unauthorized: { vi: "Không có quyền", en: "Unauthorized" },
  }

  // Translate each item in the breadcrumb array
  return breadcrumbArray.map((item) => {
    // If item has translation, use it; otherwise keep original
    if (translations[item] && translations[item][language]) {
      return translations[item][language]
    }
    // Keep dynamic values (like contest names, team names) unchanged
    return item
  })
}

// Hook to use translated breadcrumbs
export const useTranslatedBreadcrumb = (breadcrumbArray) => {
  // This will be imported in components that need it
  // For now, return as-is to maintain compatibility
  return breadcrumbArray
}
