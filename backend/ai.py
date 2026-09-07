import os
import requests
from pathlib import Path
from dotenv import load_dotenv


# Находим .env в корне проекта
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("AI_MODEL", "gemini-2.5-flash")


def ask_ai(question):

    if not API_KEY:
        return "Ошибка: GEMINI_API_KEY не найден в .env"

    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"models/{MODEL}:generateContent"
        f"?key={API_KEY}"
    )

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""
Ты AI-консультант Dalgatov.pro.

Помогаешь пользователю по темам:
- AI-инструменты
- создание контента
- SMM
- дизайн
- Telegram Mini Apps
- цифровые навыки
- развитие личного бренда

Отвечай понятно, дружелюбно и по делу.
Если пользователь новичок — объясняй простыми словами и пошагово.

Вопрос пользователя:
{question}
"""
                    }
                ]
            }
        ]
    }

    response = requests.post(
        url,
        json=data,
        timeout=60
    )

    result = response.json()

    if "candidates" not in result:
        return f"Ошибка Gemini: {result}"

    return result["candidates"][0]["content"]["parts"][0]["text"]
