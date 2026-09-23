# نبض — Nabd

مساعدك الطبي الذكي في حالات الطوارئ — واجهة أمامية فقط (Frontend).

## التقنيات المستخدمة

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Router v6

## التشغيل محلياً

محتاجة Node.js و npm مثبتين على جهازك.

```sh
npm install
npm run dev
```

هيفتح المشروع على `http://localhost:8080`.

### أوامر مفيدة

```sh
npm run build      # بناء نسخة الإنتاج
npm run preview    # معاينة نسخة الإنتاج محلياً
npm run lint       # فحص الكود
npm run test       # تشغيل الاختبارات
```

## هيكل المشروع

```
src/
  pages/       صفحات التطبيق (كل صفحة = مسار في App.tsx)
  components/  مكونات مشتركة (PhoneFrame, BottomNav, SideMenu...)
  hooks/       React hooks مخصصة (تفضيلات المستخدم، إلخ)
  lib/         منطق مشترك:
                 storage.ts → كل التخزين المحلي (localStorage) في مكان واحد
                 api.ts     → كل التواصل مع أي باك اند خارجي في مكان واحد
                 reminders.ts, utils.ts → أدوات مساعدة
```

## ملاحظة عن الباك اند

المشروع ده واجهة أمامية بس، من غير أي باك اند مرفق. البيانات محفوظة محلياً في المتصفح (localStorage) عن طريق `src/lib/storage.ts`.

لو حابة توصلي باك اند بعدين، الملفين اللي هتحتاجي تعدلي فيهم بس هما:
- `src/lib/storage.ts` — استبدلي دوال القراءة/الكتابة المحلية بطلبات API
- `src/lib/api.ts` — فيه بالفعل عنوان الباك اند (`VITE_API_URL`) وطلب جاهز لخدمة قراءة الصور، تقدري تضيفي عليه بقية الطلبات

اعملي ملف `.env` في جذر المشروع لو حبيتي تحددي عنوان باك اند:
```
VITE_API_URL=http://localhost:8000
```
