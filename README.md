<div align="center">
  <img src="https://via.placeholder.com/150/4f46e5/FFFFFF?text=Noqta+AI" alt="Noqta AI Logo" width="120" height="120" style="border-radius: 20px; box-shadow: 0 4px 60px rgba(79, 70, 229, 0.5);">
  <br />
  <br />

  <h1 style="font-size: 3rem; font-weight: bold;">🚀 Noqta AI | نقطة</h1>

  <p style="font-size: 1.2rem; color: #a1a1aa;">
    <strong>منصة ذكية لإدارة الأعمال، الفواتير، وتحليل البيانات المالية باستخدام الذكاء الاصطناعي</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB">
    <img src="https://img.shields.io/badge/Tailwind_CSS-Dark_Mode-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind">
    <img src="https://img.shields.io/badge/Auth-NextAuth.js-blue?style=flat-square" alt="NextAuth">
  </p>
</div>

<br />

## 📖 نبذة عن المشروع
**نقطة (Noqta AI)** هو نظام **SaaS (Software as a Service)** متكامل موجه للشركات الصغيرة والمتوسطة. يهدف النظام إلى تحويل البيانات المالية التقليدية (فواتير ومصروفات) إلى رؤى استراتيجية.

يتميز النظام بقدرته على التنبؤ بالإيرادات المستقبلية باستخدام خوارزميات **الانحدار الخطي (Linear Regression)**، مع نظام إدارة اشتراكات محكم وصلاحيات متعددة المستويات.

---

## ✨ المميزات الرئيسية (Key Features)

### 🧠 1. الذكاء الاصطناعي والتحليلات
* **تنبؤات مالية:** توقع إيرادات الشهر القادم بناءً على البيانات التاريخية.
* **تحليل الأداء:** تحديد أفضل العملاء، الموردين، والفروع الأكثر ربحية.
* **مؤشرات حيوية:** حساب معدلات النمو وصافي الربح لحظياً.

### 🏢 2. إدارة متعددة الفروع (Multi-Branch)
* يمكن للمشترك (Subscriber) إنشاء وإدارة عدة فروع.
* لكل فرع مستودعات، عملاء، وموردين منفصلين أو مشتركين.

### 👥 3. نظام صلاحيات متقدم (RBAC)
* **Super Admin:** لوحة تحكم شاملة لإدارة المشتركين، تفعيل الاشتراكات، وإرسال الإشعارات.
* **Subscriber (المالك):** تحكم كامل في المؤسسة، الفواتير، والموظفين.
* **Subuser (الموظف/المدير):** صلاحيات محدودة حسب الفرع والوظيفة.

### 💳 4. نظام الاشتراكات والفوترة (Subscription System)
* فترة تجريبية تلقائية (40 يوم) عند التسجيل.
* **نظام القفل الذكي:** إغلاق الصلاحيات تلقائياً عند انتهاء الاشتراك.
* **التجديد اليدوي:** دعم الدفع عبر المحافظ الإلكترونية (InstaPay/Vodafone Cash) مع نظام إشعارات للأدمن للمراجعة والتفعيل.

### 🎨 5. واجهة مستخدم عصرية (UI/UX)
* تصميم **Dark Mode** كامل ومريح للعين.
* دعم كامل للغة العربية (**RTL**).
* رسوم بيانية تفاعلية باستخدام مكتبة `Recharts`.
* تصميم متجاوب (Responsive) يعمل على جميع الأجهزة.

---

## 🛠 التقنيات المستخدمة (Tech Stack)

* **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons.
* **Backend:** Next.js Server Actions (API-less architecture).
* **Database:** MongoDB (Mongoose ODM).
* **Authentication:** NextAuth.js v4 (JWT Strategy).
* **Security:** Middleware Protection, Security Headers, Zod Validation.
* **Analytics:** Simple-Statistics, Recharts.

---

## 🚀 طريقة التشغيل (Installation)

اتبع الخطوات التالية لتشغيل المشروع على جهازك:

### 1. استنساخ المستودع
```bash
git clone [https://github.com/username/noqta-ai.git](https://github.com/username/noqta-ai.git)
cd noqta-ai