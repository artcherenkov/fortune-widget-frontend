(function () {
  const WIDGET_SCRIPT_VERSION = "2.0.29";
  const WidgetScriptSrc = {
    LOCAL: "./index.js",
    DEV: "../dist/index.js",
    PROD_UNPKG: `https://unpkg.com/fortune-widget@${WIDGET_SCRIPT_VERSION}`,
    PROD_JSDELIVR: `https://cdn.jsdelivr.net/npm/fortune-widget@${WIDGET_SCRIPT_VERSION}`,
  };
  const ROOT_SELECTOR = "#widget";
  const TRIGGER_SELECTOR = ".widget-trigger";
  const BACKEND_URL = "test.com";
  const WIDGET_NAME = "test-widget";
  const PRIZES = [
    {
      amoText: "Колесо Фортуны podruge.ru",
      text: "Приз 1 🤍",
      extraText:
        "*Стоимость процедуры без сертификата 4990 рублей, с сертификатом 2990 рублей",
      fullText:
        "сертификат на 2000 рублей на лазерную эпиляцию зоны «Все тело» на любом диодном лазере.",
      url: "https://google.com",
      color: "rgb(30,157,178)",
      textColor: "#E6FFFF",
    },
    {
      amoText: "Колесо Фортуны podruge.ru",
      text: "Приз 2 🤍",
      extraText:
        "*Стоимость процедуры без сертификата 9990 рублей, с сертификатом 4990 рублей",
      fullText:
        "сертификат на 5000 рублей на лазерную эпиляцию зоны «Все тело» на любом александритовом лазере.",
      url: "https://google.com",
      color: "rgb(42,183,193)",
      textColor: "#E6FFFF",
    },
    {
      amoText: "Колесо Фортуны podruge.ru",
      text: "Приз 3 🤍",
      extraText: "*Стоимость процедуры с сертификатом 990 рублей",
      fullText:
        "сертификат на 1500 рублей на лазерную эпиляцию зон «Бикини+подмышки» на любом диодном лазере.",
      url: "https://google.com",
      color: "rgb(30,157,178)",
      textColor: "#E6FFFF",
    },
    {
      amoText: "Колесо Фортуны podruge.ru",
      text: "Приз 4 🤍",
      extraText: "*Стоимость процедуры с сертификатом 1990 рублей",
      fullText:
        "сертификат на 3000 рублей на лазерную эпиляцию зон «Бикини+подмышки» на любом александритовом лазере.",
      url: "https://google.com",
      color: "rgb(42,183,193)",
      textColor: "#E6FFFF",
    },
    {
      amoText: "Колесо Фортуны podruge.ru",
      text: "приз 5 🔵",
      extraText: "*Стоимость процедуры с сертификатом 1990 рублей",
      fullText:
        "сертификат на 2000 рублей на лазерную эпиляцию зон «Бикини+подмышки+ голени с коленями» на любом диодном лазере.",
      url: "https://google.com",
      color: "#E6FFFF",
      textColor: "#1E96B4",
    },
    {
      amoText: "Колесо Фортуны podruge.ru",
      text: "Приз 6 🔵",
      extraText: "*Стоимость процедуры с сертификатом 2990 рублей",
      fullText:
        "сертификат на 5000 рублей на лазерную эпиляцию зон «Бикини+подмышки+ голени с коленями» на любом александритовом лазере.",
      url: "https://google.com",
      color: "#E6FFFF",
      textColor: "#1E96B4",
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
  // widgetScript.src = WidgetScriptSrc.LOCAL;
  // widgetScript.src = WidgetScriptSrc.DEV;
  widgetScript.src = WidgetScriptSrc.PROD_UNPKG;
  // widgetScript.src = WidgetScriptSrc.PROD_JSDELIVR;
  widgetScript.onload = onWidgetScriptLoad;

  document.head.appendChild(widgetScript);
})();
