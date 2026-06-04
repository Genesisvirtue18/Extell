import { AdminAuthProvider } from '@/admin/hooks/useAdminAuth';
import '@/tailwind.css';
import '@/styles.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Extell - Enterprise UPS Solutions',
  description: 'Leading provider of uninterruptible power supply systems and energy management solutions',
    icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
