#!/data/data/com.termux/files/usr/bin/bash

# Не даём Android усыпить Termux
termux-wake-lock


# Папка проекта
PROJECT="/storage/emulated/0/dalgatov_miniapp"


# Переходим в проект
cd $PROJECT


echo "🚀 Запуск Dalgatov.pro..."


# =========================
# Flask Mini App
# =========================

tmux has-session -t flask 2>/dev/null

if [ $? != 0 ]; then

    tmux new-session -d -s flask \
    "cd $PROJECT/backend && python app.py"

    echo "✅ Flask запущен"

else

    echo "ℹ️ Flask уже работает"

fi



# =========================
# Telegram Bot
# =========================

tmux has-session -t telegrambot 2>/dev/null

if [ $? != 0 ]; then

    tmux new-session -d -s telegrambot \
    "cd $PROJECT && python bot.py"

    echo "✅ Telegram Bot запущен"

else

    echo "ℹ️ Telegram Bot уже работает"

fi



# =========================
# Cloudflare Tunnel
# =========================

tmux has-session -t cloudflare 2>/dev/null

if [ $? != 0 ]; then

    tmux new-session -d -s cloudflare \
    "cloudflared tunnel --url http://127.0.0.1:5000"

    echo "✅ Cloudflare Tunnel запущен"

else

    echo "ℹ️ Cloudflare Tunnel уже работает"

fi


echo ""
echo "🎉 Dalgatov.pro полностью запущен!"
echo ""
echo "Проверить процессы:"
echo "tmux ls"
