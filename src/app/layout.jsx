import { AdminAuthProvider } from '@/admin/hooks/useAdminAuth';
import '@/tailwind.css';
import '@/styles.css';

export const metadata = {
  title: 'Extell - Enterprise UPS Solutions',
  description: 'Leading provider of uninterruptible power supply systems and energy management solutions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </body>
    </html>
  );
}
