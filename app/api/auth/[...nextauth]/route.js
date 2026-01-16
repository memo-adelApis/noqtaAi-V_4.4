import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/utils/database";
import User from "@/models/User";
import { z } from "zod";

// التحقق من صحة المدخلات
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. التحقق من صحة البيانات (Zod)
        const validation = loginSchema.safeParse(credentials);
        if (!validation.success) {
            throw new Error("بيانات الدخول غير صالحة");
        }

        await connectToDB();
        
        // جلب المستخدم مع كلمة المرور (لأنها select: false في الموديل)
        const user = await User.findOne({ email: credentials.email }).select("+password");

        // 2. الحماية من "تعداد المستخدمين" (User Enumeration)
        // نستخدم رسالة خطأ موحدة سواء كان الإيميل خطأ أو الباسورد خطأ
        if (!user || !(await user.comparePassword(credentials.password))) {
             throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        // 3. ✅ التحقق من حالة الحساب (Global Account Ban)
        // هذا يمنع الدخول تماماً إذا كان الحساب معطلاً من الإدارة
        if (user.isActive === false) {
             throw new Error("تم تعطيل هذا الحساب. يرجى التواصل مع الدعم الفني.");
        }

        // 4. التحقق من حالة الاشتراك (Subscription Check)
        // ⚠️ ملاحظة: نحن هنا لا نمنع الدخول، بل نمرر الحالة للتوكن
        // لكي نتمكن في الواجهة من توجيهه لصفحة الدفع بدلاً من طرده.
        const isSubscriptionActive = user.subscription?.isActive ?? false;
        
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          branchId: user.branchId,
          mainAccountId: user.mainAccountId,
          image: user.image,
          // تمرير حالة الاشتراك ليستخدمها التطبيق
          subscriptionActive: isSubscriptionActive 
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  
  callbacks: {
    // نقل البيانات من المستخدم إلى التوكن
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.branchId = user.branchId;
        token.mainAccountId = user.mainAccountId;
        token.image = user.image;
        token.subscriptionActive = user.subscriptionActive; // ✅ إضافة حالة الاشتراك
      }
      return token;
    },
    // نقل البيانات من التوكن إلى الجلسة (ليراها الـ Client)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.branchId = token.branchId;
        session.user.mainAccountId = token.mainAccountId;
        session.user.image = token.image;
        session.user.subscriptionActive = token.subscriptionActive; // ✅ متاحة الآن في useSession
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };