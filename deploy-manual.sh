#!/bin/bash

# 🚀 Firebase Word Card App - 緊急手動デプロイスクリプト
# GitHub Actions が失敗した場合の緊急対応用

set -e

echo "🔥 Firebase Word Card App - 緊急手動デプロイ"
echo "=============================================="
echo ""

# 環境確認
echo "📋 環境確認中..."
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""

# 依存関係インストール
echo "📦 依存関係をインストール中..."
npm ci
echo "✅ 依存関係インストール完了"
echo ""

# 品質チェック
echo "🔍 品質チェック実行中..."
echo "Type checking..."
npm run type-check

echo "Format checking..."
npm run format:check
echo "✅ 品質チェック完了"
echo ""

# ビルド実行
echo "🏗️ アプリケーションをビルド中..."
npm run build
echo "✅ ビルド完了"
echo ""

# ビルド出力確認
echo "📁 ビルド出力確認..."
ls -la out/
if [ -f "out/index.html" ]; then
    echo "✅ index.html exists"
    echo "Build size: $(du -sh out/)"
else
    echo "❌ index.html not found"
    exit 1
fi
echo ""

# Firebase CLI 確認
echo "🔧 Firebase CLI 確認中..."
if command -v firebase &> /dev/null; then
    echo "✅ Firebase CLI installed: $(firebase --version)"
else
    echo "📦 Firebase CLI をインストール中..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI インストール完了"
fi
echo ""

# Firebase ログイン確認
echo "🔐 Firebase ログイン確認中..."
if firebase projects:list &> /dev/null; then
    echo "✅ Firebase にログイン済み"
    echo "📋 Available projects:"
    firebase projects:list
else
    echo "❌ Firebase ログインが必要です"
    echo ""
    echo "🔑 以下のコマンドを実行してログインしてください:"
    echo "firebase login"
    echo ""
    echo "ログイン後、このスクリプトを再実行してください。"
    exit 1
fi
echo ""

# プロジェクト設定確認
echo "🎯 プロジェクト設定確認中..."
if [ -f "firebase.json" ]; then
    echo "✅ firebase.json exists"
    echo "Project: $(cat firebase.json | jq -r '.projects.default')"
else
    echo "❌ firebase.json not found"
    exit 1
fi
echo ""

# デプロイ実行
echo "🚀 Firebase Hosting にデプロイ中..."
echo "Target: https://meku-run.web.app"
echo ""

firebase deploy --project meku-run --only hosting

echo ""
echo "🎉 デプロイ完了！"
echo "🌐 アプリケーション URL: https://meku-run.web.app"
echo "📊 Firebase Console: https://console.firebase.google.com/project/meku-run/hosting"
echo ""
echo "✅ 手動デプロイが正常に完了しました。"