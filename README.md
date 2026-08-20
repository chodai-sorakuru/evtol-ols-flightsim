# eVTOL OLS FlightSim V24

バーティポートのOLS（Obstacle Limitation Surfaces／制限表面）と飛行経路を、Mapboxの3D地図上で確認する技術検討・概念可視化用Webアプリです。

V24は左・正面・右を同時表示する3画面コックピットに対応しています。画面比率が2.35以上の環境では自動的に3画面表示になり、画面上の「3画面」ボタンまたは `M` キーでも切り替えられます。常に3画面で起動する場合はURLの末尾に `?screens=3` を追加できます。また「録画」ボタンから表示中のタブまたはウィンドウを選び、WebM形式で保存できます。

## 公開版の構成

- `public/index.html` — Cloudflare Pagesで公開するV24本体
- `public/_headers` — Cloudflare Pages用セキュリティヘッダー
- `eVTOL_FlightSim_V24.html` — ローカル作業用のV24本体
- `launch_sim.bat` / `serve_sim.js` — Windowsでのローカル起動用

公開用HTMLとGitHubにはMapboxトークンを埋め込んでいません。通常は、組織または利用者が管理するMapbox Public Tokenを画面上で入力します。組織管理のCloudflare Pages環境では、`MANAGED_MAPBOX_ENABLED=true` と `MAPBOX_PUBLIC_TOKEN` を設定することで、同一ドメインAPIから地図設定を読み込み、自動起動できます。

Public Tokenはブラウザーで地図を表示するため最終的にクライアントへ渡されます。完全な秘匿情報としては扱えないため、Mapbox側のAllowed URLsで利用可能な公開ドメインを必ず制限してください。

## ローカル確認

`launch_sim.bat` を実行し、ブラウザーで次を開きます。

```text
http://localhost:8080/eVTOL_FlightSim_V24.html
```

## GitHubへ登録

このフォルダでリポジトリを作成し、GitHubへプッシュします。Mapboxトークンや `.env` はコミットしないでください。

## Cloudflare Pagesで公開

Cloudflare Dashboardで Workers & Pages → Create → Pages → Connect to Git を選び、GitHub上のリポジトリを接続します。

設定値は次のとおりです。

| 項目 | 設定 |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Build command | 空欄 |
| Build output directory | `public` |
| Root directory | `/` |

デプロイ後は、MapboxのPublic TokenにAllowed URLsを設定します。

```text
https://＜Cloudflareのプロジェクト名＞.pages.dev/*
https://＜独自ドメイン＞/*
http://localhost:8080/*
http://127.0.0.1:8080/*
```

独自ドメインを使用しない場合は、その行を省略します。Secret Token（`sk.`）は使用しません。

## 公開上の注意

本アプリは技術検討・概念可視化用です。実際の航空運航、航法、飛行計画、操縦訓練、技能評価、障害物クリアランス判定、設計照査、許認可、安全判断には使用できません。
