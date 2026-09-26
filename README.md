# PXPANEL NODE V1

نسخه V1 بازنویسی‌شده با Node.js + HTML/CSS/JS.

## اجرا
```bash
npm install
npm start
```

رمز پیش‌فرض:
`pxpanel2026`

برای Railway:
- Start Command: `npm start`
- `PORT` را Railway خودش مدیریت می‌کند.
- برای امنیت `ADMIN_PASSWORD` و `SECRET_KEY` را در Variables تنظیم کنید.
- برای حفظ داده‌ها، DATA_DIR را روی Volume دائمی قرار دهید.

## بک‌گراند
فایل تصویر را با نام زیر قرار دهید:
`public/assets/background.jpg`

## وضعیت V1
این نسخه هسته‌ی پنل، ورود، داشبورد، ذخیره‌سازی JSON و CRUD کانفیگ را فراهم می‌کند.
برای جایگزینی کامل PXPANEL اصلی باید Gateway/Engine و APIهای اختصاصی پروتکل‌های پروژه نیز جداگانه به Node منتقل شوند؛ صرف HTML نمی‌تواند آن قسمت‌ها را اجرا کند.
