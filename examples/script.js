const ROOT_SELECTOR = "#widget";
const TRIGGER_SELECTOR = ".widget-trigger";
const BACKEND_URL = "test.com";
const WIDGET_NAME = "test-widget";

const onWidgetScriptLoad = () => {
  console.log("widget script loaded");

  const widget = new Widget({
    prizes: [
      {
        text: "Лазерная эпиляция бикини",
        url: "https://google.com",
        color: "rgb(30,157,178)",
        textColor: "#E6FFFF",
      },
      {
        text: "Все тело",
        url: "https://google.com",
        color: "#E6FFFF",
        textColor: "#1E96B4",
      },
      {
        text: "Лазерная эпиляция подмышек",
        url: "https://google.com",
        color: "rgb(42,183,193)",
        textColor: "#E6FFFF",
      },
      {
        text: "Голени",
        url: "https://google.com",
        color: "rgb(30,157,178)",
        textColor: "#E6FFFF",
      },
      {
        text: "Все тело",
        url: "https://google.com",
        color: "#E6FFFF",
        textColor: "#1E96B4",
      },
      {
        text: "Лазерная эпиляция подмышек",
        url: "https://google.com",
        color: "rgb(42,183,193)",
        textColor: "#E6FFFF",
      },
      {
        text: "Все тело",
        url: "https://google.com",
        color: "#E6FFFF",
        textColor: "#1E96B4",
      },
      {
        text: "Лазерная эпиляция подмышек",
        url: "https://google.com",
        color: "rgb(42,183,193)",
        textColor: "#E6FFFF",
      },
    ],
    widgetName: WIDGET_NAME,
    rootSelector: ROOT_SELECTOR,
    triggerSelector: TRIGGER_SELECTOR,
    backendUrl: BACKEND_URL,
  });

  const trigger = document.querySelector(TRIGGER_SELECTOR);
  trigger.addEventListener("click", () => widget.render());
};

const widgetScript = document.createElement("script");
widgetScript.type = "text/javascript";
widgetScript.defer = true;
widgetScript.src = "https://unpkg.com/fortune-widget@2.0.13";
// widgetScript.src = "../dist/index.js";
widgetScript.onload = onWidgetScriptLoad;

document.head.appendChild(widgetScript);
