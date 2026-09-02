import requests

from config import GEMINI_API_KEY, GEMINI_MODEL
from content import SYSTEM_PROMPT

GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)


def ask_ai(user_message: str) -> str:
    """Отправляет вопрос в Gemini API и возвращает текстовый ответ.
    При любой ошибке возвращает дружелюбное сообщение вместо падения сервера."""
    try:
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                f"{SYSTEM_PROMPT}\n\n"
                                f"Вопрос пользователя: {user_message}"
                            )
                        }
                    ],
                }
            ],
            "generationConfig": {
                "maxOutputTokens": 400,
                "temperature": 0.6,
            },
        }

        response = requests.post(
            GEMINI_URL,
            params={"key": GEMINI_API_KEY},
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()

        return data["candidates"][0]["content"]["parts"][0]["text"].strip()

    except Exception as e:
        return (
            "Извините, сейчас не получается ответить 🙏 "
            "Попробуйте позже или оставьте заявку — я передам вопрос лично.\n"
            f"(техническая причина: {e})"
        )
