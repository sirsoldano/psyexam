# Webアプリ仕様書

## 概要
本アプリは、患者ごとの検査を管理し、検査結果を記録・表示するシステムです。Remix、Prisma、MySQL、Dockerを使用して構築されており、医師が患者の検査を管理できる機能を備えています。

## 技術スタック
- **フロントエンド:** Remix, React, TailwindCSS
- **バックエンド:** Remix, Prisma, Node.js
- **データベース:** MySQL
- **インフラ:** Docker, Docker Compose

## 機能一覧
### 1. 患者情報管理
- **患者IDの入力:** `/` または `/doctor` にて患者IDを入力
- **患者ごとの検査結果の表示:** `/patient/:id` または `/doctor/:id` で患者の検査履歴と予定されている検査を表示

### 2. 検査の管理
- **予定されている検査の表示:** `StackedExam` テーブルを参照し、該当する患者の検査リストを表示
- **検査の実施:** 予定されている検査に「実施する」ボタンを設置し、クリックすると `/exam/:examname?patientId=:id` に遷移
- **検査結果の記録:** 検査の質問に回答後、結果を `Result` テーブルに保存し、`StackedExam` から該当するデータを削除
- **検査の削除:** `/doctor/:id` で予定されている検査の「削除」ボタンを押すと `StackedExam` から該当データを削除
- **検査の追加:** `/doctor/:id` にて、予定されていない検査を一覧表示し、クリックで `StackedExam` に追加

### 3. 検査フォーム
- **検査項目の取得:** `/exams/:examname.json` から検査データを取得
- **質問項目の表示:** JSONの `questions` 配列をもとに質問をリスト表示
- **回答の選択:** 各質問に対して `options` 配列の値をボタン形式で選択
- **検査結果の保存:** すべての質問に回答後、`Result` テーブルに保存（未設定項目は `NULL`）
- **送信完了メッセージ:** 送信後、`/patient/:id` にリダイレクトし、数秒後に消える完了メッセージを表示

## データベース構造

### 1. `patients`（患者情報）
| カラム名     | 型        | 制約                        |
|-------------|---------|---------------------------|
| id          | INT     | PRIMARY KEY                |
| sex         | INT     |                             |
| birthdate   | DATE    |                             |
| initial     | CHAR(8) |                             |
| created_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### 2. `exams`（検査情報）
| カラム名     | 型        | 制約                        |
|-------------|---------|---------------------------|
| id          | INT     | PRIMARY KEY                |
| examname    | VARCHAR(255) | UNIQUE |
| cutoff      | INT     |                             |
| created_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### 3. `stacked_exams`（予定されている検査）
| カラム名     | 型        | 制約                        |
|-------------|---------|---------------------------|
| id          | INT     | PRIMARY KEY                |
| patient_id  | INT     | FOREIGN KEY (patients.id) ON DELETE CASCADE |
| exam_id     | INT     | FOREIGN KEY (exams.id) ON DELETE CASCADE |
| created_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### 4. `results`（検査結果）
| カラム名     | 型        | 制約                        |
|-------------|---------|---------------------------|
| id          | INT     | PRIMARY KEY                |
| patient_id  | INT     | FOREIGN KEY (patients.id) ON DELETE CASCADE |
| exam_id     | INT     | FOREIGN KEY (exams.id) ON DELETE CASCADE |
| item0~item9 | INT     | NULL許容                     |
| free0~free4 | VARCHAR(2000) | NULL許容                     |
| created_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## 画面遷移
1. `/` または `/doctor`
   - 患者IDを入力し送信 → `/patient/:id` または `/doctor/:id` へ遷移
2. `/patient/:id`
   - 予定されている検査を表示
   - 「実施する」ボタンで `/exam/:examname?patientId=:id` へ遷移
3. `/exam/:examname?patientId=:id`
   - 検査の質問を表示し、回答後送信
   - `/patient/:id` にリダイレクトし、完了メッセージを表示
4. `/doctor/:id`
   - 予定されている検査を削除可能
   - 「追加する」ボタンで新しい検査を選択可能

## API仕様
### `GET /exams/:examname.json`
- **説明:** 検査に必要な質問データをJSON形式で提供
- **レスポンス:**
```json
{
  "title": "PHQ-9 日本語版（JSAD 版）",
  "instruction": "この２週間、次のような問題にどのくらい頻繁に悩まされていますか？",
  "options": [
    { "value": 0, "label": "全くない" },
    { "value": 1, "label": "週に数日" },
    { "value": 2, "label": "週の半分以上" },
    { "value": 3, "label": "ほとんど毎日" }
  ],
  "questions": [
    { "id": 1, "text": "物事に対してほとんど興味がない、または楽しめない" },
    { "id": 2, "text": "気分が落ち込む、憂うつになる、または絶望的な気持ちになる" }
  ]
}
```

## 今後の改善点
- **認証機能の追加:** 医師のログイン認証を追加
- **CSVエクスポート:** 検査結果をCSVでダウンロード可能にする
- **UIの改善:** 患者リストの検索・ソート機能を追加

---

この仕様書をもとに、開発・運用を進めていきましょう。

