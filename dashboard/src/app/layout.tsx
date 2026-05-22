import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AuthProvider>{children}</AuthProvider>
          </SidebarProvider>
        </ThemeProvider>
        <Toaster 
          position="top-right" 
          containerStyle={{
            zIndex: 999999, 
          }}
          toastOptions={{
            style: {
              zIndex: 999999, // Makes it appear above all other elements
            },
          }}
        />
      </body>
    </html>
  );
}
