const hamburger = document.querySelector(".hamburger");
const headerRight = document.querySelector(".header-right");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    headerRight.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    headerRight.classList.remove("active");
}))

document.addEventListener('DOMContentLoaded', (event) => {
    const texts = document.querySelector('.texts');
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition


    window.botpressWebChat.init({
        "composerPlaceholder": "Hi! How can i help you",
        // "botConversationDescription": "Made by SP",
        "botName": "IOAGPL Bot",
        "botId": "27a85659-0121-49dc-bf62-6e4a69fec085",
        "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
        "messagingUrl": "https://messaging.botpress.cloud",
        "clientId": "27a85659-0121-49dc-bf62-6e4a69fec085",
        "webhookId": "d01e4edf-23dc-49db-9276-abae697088f4",
        "lazySocket": true,
        "showBotInfoPage": true,
        "themeName": "prism",
        "frontendVersion": "v1",
        "avatarUrl": "https://play-lh.googleusercontent.com/XMWHlx11Yfd7q1624ic0BBMgB8cJ-c3usY_p3ZneMGUBJZagK-uoeyfXmXeOeuA0b3c",
        "phoneNumber": "1800 2335 5666",
        "privacyPolicy": "https://ioagpl.com/privacy-policy/",
        "emailAddress": "info@ioagpl.com",
        "website": "https://ioagpl.com/",
        // "showPoweredBy": true,
        "className": "webchatIframe",
        // 'className': 'webchatIframe',
        // 'containerWidth': '50%20',
        // 'layoutWidth': '50%24',
        //   'hideWidget': true,
        'enableConversationDeletion': true,
        // 'disableAnimations': true,
        'closeOnEscape': false,
        'stylesheet': 'https://webchat-styler-css.botpress.app/prod/code/8f53671c-adcd-44d3-aa55-487886a67118/v75787/style.css',
        'showConversationsButton': false,
        'enableTranscriptDownload': true,
        'showCloseButton': true,
        "themeName": "eggplant",
        "frontendVersion": "v1",
        "useSessionStorage": true,
        "theme": "eggplant",
        "themeColor": "#2563eb",
        "enablePersistHistory": true,
        "allowedOrigins": []
    });

    let ttsLang;
    var main = document.querySelector(".main");
    var secondary = document.querySelector(".scrollable-div");
    main.style.display = "none";
    // secondary.style.display = "none";

    window.botpressWebChat.onEvent(event => {

        if (event.type === 'TRIGGER' && event.value.ttsLang) {
            main.style.display = "flex";
            // secondary.style.display = "none";
            ttsLang = event.value.ttsLang;
            console.log("Language: " + event.value.ttsLang);
        }
        else if (event.type === 'TRIGGER' && event.value.botResponse) {
            // main.style.display = "flex";
            // secondary.style.display = "none";
            // main.style.display='block';
            let currentContent = transcriptionResult.innerHTML;
            // transcriptionResult.innerHTML = currentContent + '<p>Bot: ' + event.value.botResponse + '</p>';
            console.log(currentContent);
            console.log(event.value.botResponse);
            // synthesizeSpeech(event.value.botResponse);  
            let speech = new SpeechSynthesisUtterance();
            speech.text = event.value.botResponse;
            window.speechSynthesis.speak(speech);
        }
        else {
            console.log("Something wrong :( ")
        }
    }, ['TRIGGER']);

    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");
    const transcriptionResult = document.getElementById("transcriptionResult");

    const recognition = new window.SpeechRecognition();
    // const recognition= new window.SpeechRecognition();
    let transcript = '';
    let interimTranscript = '';

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {

        // recognition = new webkitSpeechRecognition();

        recognition.continuous = true;

        recognition.interimResults = true;

        recognition.onstart = function () {

            startButton.disabled = true;

            stopButton.disabled = false;

            // transcriptionResult.innerHTML = '<p><b>Listening...</b></p>';

        };

        recognition.onerror = function (event) {
            console.error(event.error);
        };

        recognition.onend = function () {
            startButton.disabled = false;
            stopButton.disabled = true;
        };

        recognition.onresult = function (event) {
            interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }

            }
            
        };
    }
    else {
        alert("Your browser does not support the Web Speech API");
    }
    startButton.addEventListener('click', function () {
        transcript = "";
        recognition.lang = ttsLang;
        startButton.innerHTML='Listening...';
        recognition.start();

    });


    stopButton.addEventListener('click', function () {
        recognition.stop();
        const combinedTranscript = transcript + interimTranscript;
        console.log("Transcript:" + combinedTranscript);
        main.style.display = "none";
        startButton.innerHTML='Start Listening';
        window.botpressWebChat.sendPayload({
            type: 'trigger',
            payload: { sttTranscript: combinedTranscript }
        });
    });
});
