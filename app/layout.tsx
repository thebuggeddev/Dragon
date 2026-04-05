import type {Metadata} from 'next';
import { Silkscreen } from 'next/font/google';
import './globals.css'; // Global styles

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-silkscreen',
});

export const metadata: Metadata = {
  title: 'Voxel Dragon Visualizer',
  description: 'Interactive 3D Voxel Dragon Visualizer',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={silkscreen.variable}>
      <body className="font-pixel antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
