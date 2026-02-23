import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ラフマニのアニメ帳',
  description: 'アニメ・アニメ映画の視聴履歴管理アプリ',
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
