const ROOT_SELECTOR = "#widget";
const TRIGGER_SELECTOR = "button";

const widget = new Widget({
  prizes: [
    { text: "Лазерная эпиляция подмышек", color: "#1620eb" },
    { text: "Лазерная эпиляция бикини", color: "#262ef7" },
    { text: "😢", color: "#121ce2" },
    { text: "Бритьё жопы", color: "#1620eb" },
    { text: "Мытьё морды", color: "#262ef7" },
  ],
  rootSelector: ROOT_SELECTOR,
  triggerSelector: TRIGGER_SELECTOR,
});

widget.render();
