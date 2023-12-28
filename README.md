# ConoHa Bot

この Discord Bot は、ConoHa の API を利用して、サーバーの起動・停止・再起動・スナップショットの作成・削除を行うことができます。

## 使い方

### インストール

```bash
pnpm install
```

### JavaScript にコンパイル

```bash
pnpm build
```

### 環境変数の設定

`.env.example` を参考に、`.env` ファイルを作成してください。

- `Discord`: [Discord Developer Portal](https://discord.com/developers/docs/intro)
- `ConoHa`: [ConoHa API](https://www.conoha.jp/docs/)

### 実行

```bash
pnpm start
```

## コマンド

### サーバーの起動

- `/start`: サーバーを起動します。
- `/stop`: サーバーを停止します。
- `/restart`: サーバーを再起動します。
- `/status`: サーバーのステータスを確認します。
