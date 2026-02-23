import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ANIME TRACKER // あなたの視聴記録',
  description: 'アニメ・映画の視聴履歴管理アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="bg-particles" />
        {children}
      </body>
    </html>
  );
}
