const ROOT_SELECTOR = "#widget";
const TRIGGER_SELECTOR = "button";

const onWidgetScriptLoad = () => {
  console.log("widget script loaded");

  const trigger = document.querySelector(TRIGGER_SELECTOR);

  const widget = new Widget({
    prizes: [
      {
        text: "Лазерная эпиляция подмышек",
        url: "https://google.com",
        color: "#E6FFFF",
        textColor: "#1E96B4",
      },
      {
        text: "Лазерная эпиляция бикини",
        url: "https://google.com",
        color: "#1E96B4",
        textColor: "#E6FFFF",
      },
      {
        text: "😢",
        url: "https://google.com",
        color: "#E6FFFF",
        textColor: "red",
      },
      {
        text: "Бикини + подмышки",
        url: "https://google.com",
        color: "#1E96B4",
        textColor: "#E6FFFF",
      },
      {
        text: "Все тело",
        url: "https://google.com",
        color: "#E6FFFF",
        textColor: "#1E96B4",
      },
      {
        text: "Голени",
        url: "https://google.com",
        color: "#1E96B4",
        textColor: "#E6FFFF",
      },
    ],
    rootSelector: ROOT_SELECTOR,
    triggerSelector: TRIGGER_SELECTOR,
  });

  trigger.addEventListener("click", widget.render);
};

onWidgetScriptLoad();

const onWheelScriptLoad = () => {
  console.log("wheel script loaded");
  const widgetScript = document.createElement("script");
  widgetScript.type = "text/javascript";
  widgetScript.defer = true;
  widgetScript.src = "https://unpkg.com/fortune-widget@1.0.1/dist/index.js";

  widgetScript.onload = onWidgetScriptLoad;

  document.head.appendChild(widgetScript);
};

const wheelScript = document.createElement("script");
wheelScript.type = "text/javascript";
wheelScript.defer = true;
wheelScript.src = "https://unpkg.com/fortune-wheel@2.0.11/dist/index.js";
wheelScript.onload = onWheelScriptLoad;

document.head.appendChild(wheelScript);
