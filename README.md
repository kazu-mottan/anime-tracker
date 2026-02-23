# ANIME TRACKER // あなたの視聴記録

アニメ・映画の視聴履歴を管理するWebアプリケーションです。ネオンテーマのUIで、作品の追加・ステータス管理・フィルタリングができます。

## 機能

- 作品の追加（タイトル・種別・ステータス・カバー画像URL・メモ）
- ステータス管理（視聴予定 → 視聴中 → 視聴済み）
- 種別フィルター（アニメ / 映画）
- ステータスフィルター（視聴済み / 視聴中 / 視聴予定）
- キーワード検索
- 統計表示（総数・視聴済み・視聴中・視聴予定）
- データはブラウザの localStorage に保存

## 技術スタック

- [Next.js](https://nextjs.org/) 13 (App Router)
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 3
- [Framer Motion](https://www.framer.com/motion/) - アニメーション
- [Lucide React](https://lucide.dev/) - アイコン

## プロジェクト構成

```
anime-tracker/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインページ
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── Header.tsx          # ヘッダー・統計表示
│   ├── FilterBar.tsx       # 検索・フィルター
│   ├── AnimeCard.tsx       # 作品カード
│   ├── AddModal.tsx        # 作品追加モーダル
│   └── StatusBadge.tsx     # ステータスバッジ
├── hooks/
│   └── useMediaList.ts     # 作品リスト管理 (localStorage)
├── types/
│   └── index.ts            # 型定義
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start
```

開発サーバーは http://localhost:3000 で起動します。

## ライセンス

MIT
