// src/app/dashboard/review/page.tsx
// src/app/dashboard/cards/page.tsx
// src/app/dashboard/statistics/page.tsx

export default function PageName() {
    // نام صفحه را تغییر دهید
    const pageTitle = "مرور"; // یا "مدیریت کارت‌ها" یا "آمار و تحلیل"
  
    return (
      <div>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="text-gray-600 mt-2">
          این صفحه در حال توسعه است. به زودی قابلیت‌های جدید به اینجا اضافه خواهد شد.
        </p>
      </div>
    );
  }