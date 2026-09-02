from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Update,
    WebAppInfo,
)

from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
)

from backend.config import TELEGRAM_BOT_TOKEN, WEBAPP_URL


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):

    keyboard = InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton(
                    text="🚀 Открыть Dalgatov App",
                    web_app=WebAppInfo(
                        url=WEBAPP_URL
                    ),
                )
            ]
        ]
    )

    await update.message.reply_text(
        "Привет! Я — AI-ассистент Dalgatov.pro 👋\n\n"
        "Открой приложение внутри Telegram.\n"
        "Там доступны услуги, портфолио и AI-помощник.",
        reply_markup=keyboard,
    )


def main():

    application = Application.builder().token(
        TELEGRAM_BOT_TOKEN
    ).build()

    application.add_handler(
        CommandHandler("start", start)
    )

    print("Бот запущен. Нажми Ctrl+C для остановки.")

    application.run_polling()


if __name__ == "__main__":
    main()
