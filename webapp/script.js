const tg = window.Telegram ? window.Telegram.WebApp : null;


if (tg) {
    tg.ready();
    tg.expand();
}


// Все экраны

const screens = document.querySelectorAll(".screen");
const buttons = document.querySelectorAll(".nav-btn");


// Переключение экранов

function showScreen(name) {

    screens.forEach(screen => {

        screen.classList.toggle(
            "active",
            screen.id === `screen-${name}`
        );

    });


    buttons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.target === name
        );

    });

}


// Кнопки меню

buttons.forEach(button => {

    button.addEventListener("click", () => {

        showScreen(button.dataset.target);

    });

});


// Верхние кнопки

document.querySelectorAll("[data-target]")
.forEach(button => {

    button.addEventListener("click", () => {

        showScreen(button.dataset.target);

    });

});


// Telegram пользователь

function getUser(){

    if(
        tg &&
        tg.initDataUnsafe &&
        tg.initDataUnsafe.user
    ){

        return tg.initDataUnsafe.user;

    }

    return null;

}


// Профиль

const user = getUser();

if(user){

    console.log("Пользователь:", user.first_name);

}


// AI сообщение

const aiButton = document.querySelector(".ai-input-row button");
const aiInput = document.querySelector(".ai-input-row input");
const chat = document.querySelector(".ai-chat");


if(aiButton){

    aiButton.addEventListener("click", async ()=>{

        const text = aiInput.value.trim();

        if(!text) return;


        // Сообщение пользователя

        const message = document.createElement("div");

        message.className = "ai-msg user";

        message.textContent = text;

        chat.appendChild(message);


        aiInput.value = "";


        // Индикатор загрузки

        const loading = document.createElement("div");

        loading.className = "ai-msg bot";

        loading.textContent = "Думаю... 🤔";

        chat.appendChild(loading);


        try {

            // Отправляем вопрос на Flask → Gemini

const response = await fetch("/api/ask", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({

        question: text,

        telegram_id: user ? user.id : "guest",

        username: user ? user.username : "guest"

    })

});


const data = await response.json();

console.log("Ответ Flask:", data);

            // Удаляем "Думаю..."

            loading.remove();


            // Ответ AI

            const answer = document.createElement("div");

            answer.className = "ai-msg bot";

            answer.textContent =
                data.answer || "Не удалось получить ответ от AI.";


            chat.appendChild(answer);


        } catch(error) {

            loading.remove();


            const answer = document.createElement("div");

            answer.className = "ai-msg bot";

            answer.textContent =
                "Не удалось связаться с AI. Попробуй ещё раз.";

            chat.appendChild(answer);


            console.error("AI error:", error);

        }

    });

}


// Старт

showScreen("home");
