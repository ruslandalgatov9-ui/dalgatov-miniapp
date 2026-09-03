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

aiButton.addEventListener("click",()=>{


    const text = aiInput.value.trim();


    if(!text) return;


    const message = document.createElement("div");

    message.className="ai-msg user";

    message.textContent=text;


    chat.appendChild(message);


    aiInput.value="";


    setTimeout(()=>{


        const answer=document.createElement("div");

        answer.className="ai-msg bot";

        answer.textContent=
        "Сейчас я обучаюсь. Скоро помогу с AI, контентом и цифровыми навыками 🚀";


        chat.appendChild(answer);


    },700);



});


}



// Старт

showScreen("home");
