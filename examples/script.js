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

  trigger.addEventListener("click", widget.render);
};

const onWheelScriptLoad = () => {
  console.log("wheel script loaded");
  const widgetScript = document.createElement("script");
  widgetScript.type = "text/javascript";
  widgetScript.defer = true;
  widgetScript.src = "https://unpkg.com/fortune-widget@1.0.9/dist/index.js";

  widgetScript.onload = onWidgetScriptLoad;

  document.head.appendChild(widgetScript);
};

const wheelScript = document.createElement("script");
wheelScript.type = "text/javascript";
wheelScript.defer = true;
wheelScript.src = "https://unpkg.com/fortune-wheel@2.0.11/dist/index.js";
wheelScript.onload = onWheelScriptLoad;

document.head.appendChild(wheelScript);
