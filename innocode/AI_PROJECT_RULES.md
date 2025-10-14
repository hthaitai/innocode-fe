# InnoCode - AI Development Rules & Guidelines

## 🎯 Project Overview
**InnoCode** là một nền tảng thi lập trình trực tuyến dành cho học sinh trung học phổ thông, cung cấp:
- Hệ thống chấm điểm tự động
- Cuộc thi đa vòng
- Bảng xếp hạng thời gian thực
- Giao diện quản lý cho giáo viên và tổ chức

## 🎨 Design System & UI/UX Guidelines

### Color Palette
```css
/* Primary Colors */
--primary-orange: #ff6b35;        /* Main brand color */
--primary-orange-hover: #e55a2b;  /* Hover state */
--secondary-orange: #f7931e;      /* Secondary brand */
--accent-orange: #ffd89b;         /* Light accent */

/* Neutral Colors */
--background-main: #F3F3F3;       /* Main background */
--white: #ffffff;                 /* Cards, containers */
--text-primary: #2d3748;          /* Main text */
--text-secondary: #4a5568;        /* Secondary text */
--text-muted: #6b7280;            /* Muted text */
--text-light: #9ca3af;            /* Placeholder text */

/* UI Colors */
--border-light: #e5e7eb;          /* Light borders */
--border-medium: #d1d5db;         /* Medium borders */
--hover-gray: #e2e8f0;            /* Hover backgrounds */
--hover-light: #f9fafb;           /* Light hover */

/* Status Colors */
--success: #34a853;               /* Success states */
--error: #ea4335;                 /* Error states */
--warning: #fbbc05;               /* Warning states */
--info: #3b82f6;                  /* Info/links */
```

### Typography
```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Font Sizes */
--text-xs: 0.8rem;      /* 12.8px - Legal text, small labels */
--text-sm: 0.9rem;      /* 14.4px - Form labels, small text */
--text-base: 1rem;      /* 16px - Body text, inputs */
--text-lg: 1.1rem;      /* 17.6px - Descriptions */
--text-xl: 1.25rem;     /* 20px - Hero descriptions */
--text-2xl: 1.5rem;     /* 24px - Section titles */
--text-3xl: 2rem;       /* 32px - Page titles */
--text-4xl: 2.5rem;     /* 40px - Home container titles */
--text-5xl: 3.5rem;     /* 56px - Hero titles */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
/* Spacing Scale (based on 4px grid) */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
```

### Border Radius
```css
/* Border Radius Scale */
--radius-sm: 4px;       /* Small elements */
--radius-md: 6px;       /* Buttons, inputs */
--radius-lg: 8px;       /* Cards, containers */
--radius-xl: 12px;      /* CTA buttons */
--radius-2xl: 20px;     /* Rounded buttons */
--radius-3xl: 24px;     /* Large containers */
--radius-full: 50%;     /* Circular elements */
```

### Component Guidelines

#### Buttons
```css
/* Primary Button */
.primary-button {
  background: var(--primary-orange);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  padding: 1rem 2rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
}

.primary-button:hover {
  background: var(--primary-orange-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

/* Secondary Button */
.secondary-button {
  background: var(--white);
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-2xl);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.secondary-button:hover {
  background: var(--hover-light);
}
```

#### Cards
```css
.contest-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: background-color 0.2s ease;
}

.contest-card:hover {
  background: var(--hover-gray);
}
```

#### Form Elements
```css
.form-input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--info);
}
```

### Layout Structure

#### Main Layout
- **Navbar**: Fixed top, height 84px, white background
- **Sidebar**: Fixed left, width 280px, starts below navbar
- **Main Content**: Margin-left 280px, margin-top 84px
- **Page Content**: Max-width 1200px, centered with 200px margins

#### Responsive Breakpoints
```css
/* Mobile First Approach */
@media (max-width: 768px) {
  .sidebar { width: 100%; position: relative; }
  .main-content { margin-left: 0; }
  .page-content { margin-inline: 1rem; }
}
```

### Icon Guidelines
- **Size**: 20px for small icons, 24px for medium, 60px for logos
- **Style**: Outline style preferred, consistent stroke width
- **Color**: Inherit from parent text color
- **Library**: @iconify/react for consistency

### Animation & Transitions
```css
/* Standard Transitions */
--transition-fast: 0.15s ease;
--transition-normal: 0.2s ease;
--transition-slow: 0.3s ease;

/* Hover Effects */
.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

## 🏗️ Technical Guidelines

### File Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Sidebar)
│   ├── contest/        # Contest-related components
│   ├── search/         # Search components
│   └── authenticate/   # Authentication components
├── pages/              # Page components
├── config/             # Configuration files
├── data/               # Static data
└── assets/             # Images, icons
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ContestCard.jsx`)
- **Files**: kebab-case for CSS (e.g., `contest-card.css`)
- **Classes**: kebab-case (e.g., `.contest-card__title`)
- **Variables**: camelCase (e.g., `userName`)

### CSS Organization
1. **Layout styles** first
2. **Component styles** second
3. **Utility classes** last
4. **Responsive styles** at the end of each section

### Component Structure
```jsx
// 1. Imports
import React from 'react';
import './ComponentName.css';

// 2. Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // 3. State and hooks
  // 4. Event handlers
  // 5. Render logic
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

// 6. Export
export default ComponentName;
```

## 🎯 Content Guidelines

### Tone & Voice
- **Professional yet approachable**
- **Clear and concise**
- **Encouraging for students**
- **Technical but accessible**

### Text Hierarchy
1. **Hero titles**: Bold, large, attention-grabbing
2. **Section titles**: Medium weight, clear structure
3. **Body text**: Regular weight, readable
4. **Labels**: Medium weight, descriptive
5. **Muted text**: Light weight, supplementary

## 🚀 Development Best Practices

### Performance
- Use CSS custom properties for consistent theming
- Optimize images and assets
- Implement lazy loading for large components
- Use React.memo for expensive components

### Accessibility
- Maintain proper color contrast ratios
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation support

### Code Quality
- Follow consistent naming conventions
- Write self-documenting code
- Use meaningful variable names
- Keep components focused and single-purpose

## 📱 Responsive Design

### Mobile-First Approach
- Design for mobile first, then enhance for larger screens
- Use relative units (rem, em, %) over fixed units (px)
- Test on multiple device sizes
- Ensure touch targets are at least 44px

### Breakpoint Strategy
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Tools & Dependencies

### Core Stack
- **React 19.1.1** - UI framework
- **Vite** - Build tool
- **Tailwind CSS 4.1.13** - Utility-first CSS
- **React Router DOM 7.9.3** - Routing

### Development Tools
- **ESLint** - Code linting
- **@iconify/react** - Icon library

---

**Lưu ý**: Khi phát triển bất kỳ component hoặc tính năng mới nào, hãy tuân thủ nghiêm ngặt các quy tắc này để đảm bảo tính nhất quán trong toàn bộ dự án InnoCode.
