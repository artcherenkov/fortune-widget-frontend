const WIDGET_SCRIPT_VERSION = "2.0.23";
const WidgetScriptSrc = {
  LOCAL: "./index.js",
  DEV: "../dist/index.js",
  PROD: `https://unpkg.com/fortune-widget@${WIDGET_SCRIPT_VERSION}`,
};
const ROOT_SELECTOR = "#widget";
const TRIGGER_SELECTOR = ".widget-trigger";
const BACKEND_URL = "test.com";
const WIDGET_NAME = "test-widget";
const PRIZES = [
  {
    amoText: "some amo text",
    text: "Приз 1 🤍",
    fullText: "Лазерная эпиляция любой зоны за 500 руб.",
    url: "https://google.com",
    color: "rgb(30,157,178)",
    textColor: "#E6FFFF",
  },
  {
    amoText: "some amo text",
    text: "Все тело 🔵",
    fullText:
      'Лазерная эпиляция "Все тело" за 2990 руб. на диодном лазере, 4990 руб. на александритовом лазере.',
    url: "https://google.com",
    color: "#E6FFFF",
    textColor: "#1E96B4",
  },
  {
    amoText: "some amo text",
    text: "Приз 2 🤍",
    fullText:
      'Лазерная эпиляция "Бикини + Подмышки" за  990 руб на диодном лазере или 1990 руб. на александритовом лазере.',
    url: "https://google.com",
    color: "rgb(42,183,193)",
    textColor: "#E6FFFF",
  },
  {
    amoText: "some amo text",
    text: "Приз 3 🤍",
    fullText:
      'Лазерная эпиляция "Бикини (на выбор) + Подмышки + Голени с коленями"  за 1.990 руб. на диодном лазере и 2.990 руб. на элександритовом лазере.',
    url: "https://google.com",
    color: "rgb(30,157,178)",
    textColor: "#E6FFFF",
  },
  {
    amoText: "some amo text",
    text: "3000 руб. 🔵",
    fullText:
      "Сертификат на 3000 руб., которым можно оплатить до 50% стоимости лазерной эпиляции.",
    url: "https://google.com",
    color: "#E6FFFF",
    textColor: "#1E96B4",
  },
  {
    amoText: "some amo text",
    text: "Приз 4 🤍",
    fullText: "-50% на лазерную эпиляцию на любом лазере.",
    url: "https://google.com",
    color: "rgb(42,183,193)",
    textColor: "#E6FFFF",
  },
];

const onWidgetScriptLoad = () => {
  console.log("widget script loaded");

  const widget = new Widget({
    prizes: PRIZES,
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
widgetScript.src = WidgetScriptSrc.PROD;
widgetScript.onload = onWidgetScriptLoad;

document.head.appendChild(widgetScript);
