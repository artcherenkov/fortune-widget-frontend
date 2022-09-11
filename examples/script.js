const ROOT_SELECTOR = "#widget";
const TRIGGER_SELECTOR = "button";

const onWidgetScriptLoad = () => {
  console.log("widget script loaded");

  const trigger = document.querySelector(TRIGGER_SELECTOR);

  const widget = new Widget({
    prizes: [
      {
        text: "Лазерная эпиляция бикини",
        url: "https://google.com",
        color: "#1E96B4",
        textColor: "#E6FFFF",
      },
      {
        text: "Лазерная эпиляция подмышек",
        url: "https://google.com",
        color: "#E6FFFF",
        textColor: "#1E96B4",
      },
      {
        text: "Голени",
        url: "https://google.com",
        color: "#f582f3",
        textColor: "#E6FFFF",
      },
      {
        text: "Все тело",
        url: "https://google.com",
        color: "#E6FFFF",
        textColor: "#1E96B4",
      },
    ],
    rootSelector: ROOT_SELECTOR,
    triggerSelector: TRIGGER_SELECTOR,
    backendUrl: "test.com",
  });

  trigger.addEventListener("click", () => {
    widget.render();
  });
};

const widgetScript = document.createElement("script");
widgetScript.type = "text/javascript";
widgetScript.defer = true;
widgetScript.src = "https://unpkg.com/fortune-widget@2.0.4/dist/index.js";
// widgetScript.src = "../dist/index.js";
widgetScript.onload = onWidgetScriptLoad;

document.head.appendChild(widgetScript);
