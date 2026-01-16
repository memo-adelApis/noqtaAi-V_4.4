import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // 1. تعريف المسارات والأدوار
    const publicRoutes = ["/", "/login", "/register", "/about"]; // أضف أي مسارات عامة هنا
    const authRoutes = ["/login", "/register"]; // الصفحات التي لا يجب للمسجل الدخول إليها
    
    // 2. جلب التوكن
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET 
    });

    // --- الحالة أ: المستخدم غير مسجل دخول (Guest) ---
    if (!token) {
        // إذا كان المسار عاماً، اسمح بالمرور
        if (publicRoutes.includes(pathname)) {
            return NextResponse.next();
        }
        // خلاف ذلك، وجهه لصفحة الدخول مع حفظ المسار الذي كان يريده
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // --- الحالة ب: المستخدم مسجل دخول (Logged In) ---
    const role = token.role;

    // تحديد هوية المستخدم ومساره الافتراضي (Home)
    const isAdmin = role === 'admin';
    const isSubscriber = role === 'subscriber' || role === 'subscription';
    const isSubuser = role === 'employee' || role === 'manager' || role === 'subuser';

    let userHome = "/";
    if (isAdmin) userHome = "/admin"; // ✅ مسار الأدمن الجديد
    else if (isSubscriber) userHome = "/subscriber/dashboard";
    else if (isSubuser) userHome = "/subuser/home";

    // 1. منع المسجلين من دخول صفحات الدخول والتسجيل
    if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(userHome, req.url));
    }

    // 2. 🛡️ حماية المناطق (Role-Based Access Control)
    
    // حماية منطقة الأدمن
    if (pathname.startsWith("/admin") && !isAdmin) {
        return NextResponse.redirect(new URL(userHome, req.url)); // طرد المتطفلين لمسارهم الصحيح
    }

    // حماية منطقة المشترك
    if (pathname.startsWith("/subscriber") && !isSubscriber) {
        // إذا كان أدمن، ربما نسمح له، لكن هنا سنفصلهم للأمان
        // إذا كان موظفاً وحاول الدخول، نطرده لصفحته
        return NextResponse.redirect(new URL(userHome, req.url));
    }

    // حماية منطقة الموظف (Subuser)
    if (pathname.startsWith("/subuser") && !isSubuser) {
        return NextResponse.redirect(new URL(userHome, req.url));
    }

    // 3. (اختياري) توجيه من الصفحة الرئيسية "/" إلى لوحة التحكم مباشرة
    if (pathname === "/") {
        return NextResponse.redirect(new URL(userHome, req.url));
    }

    return NextResponse.next();
}

export const config = {
    // استثناء الملفات الثابتة والصور والـ API
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|images|manifest.json).*)'],
};