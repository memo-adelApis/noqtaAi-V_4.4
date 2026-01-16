import { redirect } from 'next/navigation';
import { getSafeSession } from '@/app/lib/auth';
import User from '@/models/User'; 
import SubuserLayoutClient from '@/components/layout/SubuserLayoutClient'; // استيراد المكون الذي أنشأناه

export default async function SubuserLayout({ children }) {
    // 1. التحقق من الجلسة
    let session;
    try {
        session = await getSafeSession();
    } catch (error) {
        redirect('/login'); 
    }

    // 2. التحقق من الصلاحيات (حماية المسار)
    if (session.user.role !== 'employee' && session.user.role !== 'manager') {
        if(session.user.role === 'subscriber') {
            redirect('/subscriber/dashboard');
        } else {
            redirect('/login'); 
        }
    }

    // 3. جلب بيانات الموظف الحقيقية من الداتابيس
    const currentSubuser = await User.findById(session.user.id)
        .select('mainAccountId name email role image')
        .lean();
    
    // إذا كان الموظف يتيماً (ليس له مدير)، نطرده
    if (!currentSubuser || !currentSubuser.mainAccountId) {
        redirect('/login?error=no_manager');
    }

    // 4. جلب اشتراك المدير (المالك الأصلي)
    const mainAccount = await User.findById(currentSubuser.mainAccountId)
        .select('subscription')
        .lean();

    if (!mainAccount) {
         redirect('/login?error=manager_not_found');
    }

    // 5. تجهيز البيانات للعميل (Data Serialization)
    // هنا نضع اشتراك المدير داخل كائن الموظف
    const userForClient = {
        _id: currentSubuser._id.toString(),
        name: currentSubuser.name,
        email: currentSubuser.email,
        role: currentSubuser.role,
        image: currentSubuser.image,
        subscription: {
            isActive: mainAccount.subscription?.isActive ?? false,
            plan: mainAccount.subscription?.plan,
            startDate: mainAccount.subscription?.startDate?.toISOString(),
            endDate: mainAccount.subscription?.endDate?.toISOString(),
        }
    };

    // 6. استدعاء مكون العميل
    return (
        <SubuserLayoutClient user={userForClient}>
            {children}
        </SubuserLayoutClient>
    );
}