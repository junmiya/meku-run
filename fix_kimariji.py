#!/usr/bin/env python3
import re
import json

# マスターデータから取得した正しい決まり字マップ
kimariji_map = {
    "9": {"pattern": "はなの", "length": 3, "category": 3},
    "21": {"pattern": "いまこ", "length": 3, "category": 3},
    "25": {"pattern": "なにし", "length": 3, "category": 3},
    "29": {"pattern": "こころあ", "length": 4, "category": 4},
    "30": {"pattern": "ありあ", "length": 3, "category": 3},
    "31": {"pattern": "あさぼらけあ", "length": 6, "category": 6},
    "32": {"pattern": "やまが", "length": 3, "category": 3},
    "35": {"pattern": "ひとは", "length": 3, "category": 3},
    "38": {"pattern": "わすら", "length": 3, "category": 3},
    "39": {"pattern": "あさぢ", "length": 3, "category": 3},
    "42": {"pattern": "ちぎりき", "length": 4, "category": 4},
    "44": {"pattern": "あふこ", "length": 3, "category": 3},
    "45": {"pattern": "あはれ", "length": 3, "category": 3},
    "48": {"pattern": "かぜを", "length": 3, "category": 3},
    "49": {"pattern": "みかき", "length": 3, "category": 3},
    "50": {"pattern": "きみがためを", "length": 6, "category": 6},
    "53": {"pattern": "なげき", "length": 3, "category": 3},
    "54": {"pattern": "わすれ", "length": 3, "category": 3},
    "56": {"pattern": "あらざ", "length": 3, "category": 3},
    "58": {"pattern": "ありま", "length": 3, "category": 3},
    "60": {"pattern": "おほえ", "length": 3, "category": 3},
    "63": {"pattern": "いまは", "length": 3, "category": 3},
    "64": {"pattern": "あさぼらけう", "length": 6, "category": 6},
    "67": {"pattern": "はるの", "length": 3, "category": 3},
    "68": {"pattern": "こころに", "length": 4, "category": 4},
    "69": {"pattern": "あらし", "length": 3, "category": 3},
    "75": {"pattern": "ちぎりお", "length": 4, "category": 4},
    "76": {"pattern": "わたのはらこ", "length": 6, "category": 6},
    "78": {"pattern": "あはぢ", "length": 3, "category": 3},
    "79": {"pattern": "あきか", "length": 3, "category": 3},
    "80": {"pattern": "ながから", "length": 4, "category": 4},
    "83": {"pattern": "よのなかよ", "length": 5, "category": 5},
    "84": {"pattern": "ながら", "length": 3, "category": 3},
    "86": {"pattern": "なげけ", "length": 3, "category": 3},
    "92": {"pattern": "わがそ", "length": 3, "category": 3},
    "93": {"pattern": "よのなかは", "length": 5, "category": 5},
    "95": {"pattern": "おほけ", "length": 3, "category": 3},
    "96": {"pattern": "はなさ", "length": 3, "category": 3},
    "98": {"pattern": "かぜそ", "length": 3, "category": 3},
    "99": {"pattern": "ひともお", "length": 4, "category": 4}
}

print("重要な決まり字修正が必要な札:")
for card_id, data in kimariji_map.items():
    print(f"札{card_id}番: {data['pattern']} ({data['category']}字決まり)")