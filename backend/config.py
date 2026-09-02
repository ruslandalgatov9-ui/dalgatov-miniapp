from pathlib import Path

from dotenv import load_dotenv
import os

# Корень проекта — на уровень выше папки backend/, там лежит .env
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
ADMIN_ID = os.getenv("ADMIN_ID")
WEBAPP_URL = os.getenv("WEBAPP_URL", "http://localhost:5000")

if not TELEGRAM_BOT_TOKEN:
    raise ValueError(
        "TELEGRAM_BOT_TOKEN не найден. Открой файл .env в корне проекта "
        "и вставь токен от @BotFather."
    )

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY не найден. Открой файл .env и вставь ключ с ai.google.dev."
    )

if not ADMIN_ID:
    raise ValueError(
        "ADMIN_ID не найден. Открой файл .env и вставь свой Telegram ID "
        "(узнать его можно у @userinfobot)."
    )
