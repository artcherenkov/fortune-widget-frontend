const ROOT_SELECTOR = "#widget";
const TRIGGER_SELECTOR = "button";

const onWidgetScriptLoad = () => {
  console.log("widget script loaded");
  const widget = new Widget({
    prizes: [
      {
        text: "Лазерная эпиляция подмышек",
        color: "#E6FFFF",
        textColor: "#1E96B4",
      },
      {
        text: "Лазерная эпиляция бикини",
        color: "#1E96B4",
        textColor: "#E6FFFF",
      },
      { text: "😢", color: "#E6FFFF", textColor: "red" },
      { text: "Бикини + подмышки", color: "#1E96B4", textColor: "#E6FFFF" },
      { text: "Все тело", color: "#E6FFFF", textColor: "#1E96B4" },
      { text: "Голени", color: "#1E96B4", textColor: "#E6FFFF" },
    ],
    rootSelector: ROOT_SELECTOR,
    triggerSelector: TRIGGER_SELECTOR,
  });

  widget.render();
};

const onWheelScriptLoad = () => {
  console.log("wheel script loaded");
  const widgetScript = document.createElement("script");
  widgetScript.type = "text/javascript";
  widgetScript.defer = true;
  widgetScript.src = "https://unpkg.com/fortune-widget@1.0.0/dist/index.js";
  widgetScript.onload = onWidgetScriptLoad;

  document.head.appendChild(widgetScript);
};

const wheelScript = document.createElement("script");
wheelScript.type = "text/javascript";
wheelScript.defer = true;
wheelScript.src = "https://unpkg.com/fortune-wheel@2.0.10/dist/index.js";
wheelScript.onload = onWheelScriptLoad;

document.head.appendChild(wheelScript);
