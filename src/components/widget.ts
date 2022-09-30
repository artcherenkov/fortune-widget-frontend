import { IWidget, TPrize } from "../types";
import IMask from "imask";

import "../styles/style.css";
import "../styles/wheel-overlay.css";
import "../styles/widget.css";
import FortuneWheel from "./wheel";

enum ECssClass {
  Popup = "fortune-popup",
  PopupOpen = "fortune-popup_open",
  PopupLayout = "fortune-popup__layout",
  PopupForm = "fortune-popup__form",
}

const icon = require("../icon-wheel.svg");

const SPINNER_ROOT_SELECTOR = "#spinner";
const SPINNER_TRIGGER_SELECTOR = ".fortune-popup__trigger";

const MOCK_WHEEL_PROPS = {
  size: 250,
  rootSelector: SPINNER_ROOT_SELECTOR,
  triggerSelector: SPINNER_TRIGGER_SELECTOR,
};

export default class Widget {
  _prizes: any;
  _rootSelector: string;
  _triggerSelector: string;
  _backendUrl: string;
  _widgetName: string;

  _rootElement: HTMLElement;
  _triggerElement: HTMLButtonElement;
  _popupLayoutElement: HTMLDivElement;
  _formElement: HTMLFormElement;
  _spinnerContainerElement: HTMLElement;
  _spinButtonElement: HTMLButtonElement;
  _inputElements: HTMLInputElement[];
  _spinMoreBtnElement: HTMLButtonElement;
  _popupContentElement: HTMLElement;
  _phoneInputElement: HTMLInputElement;

  _popupElement: HTMLDivElement;
  _fortuneWheel: any;
  _mask: any;

  constructor({
    widgetName,
    rootSelector,
    triggerSelector,
    prizes,
    backendUrl,
  }: IWidget) {
    this._widgetName = widgetName;
    this._prizes = prizes;
    this._rootSelector = rootSelector;
    this._triggerSelector = triggerSelector;
    this._backendUrl = backendUrl;

    this._triggerElement = document.querySelector(this._triggerSelector);
    this._triggerElement.removeAttribute("style");
    this._renderTriggerButton();

    this.render = this.render.bind(this);
    this.close = this.close.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onSpinStart = this._onSpinStart.bind(this);
    this._onSpinEnd = this._onSpinEnd.bind(this);
    this._init = this._init.bind(this);
    this._onSpinMoreBtnClick = this._onSpinMoreBtnClick.bind(this);

    this._setupEventListeners = this._setupEventListeners.bind(this);
  }

  _init() {
    this._rootElement = document.querySelector(this._rootSelector);
    this._triggerElement = document.querySelector(this._triggerSelector);

    this._rootElement.insertAdjacentHTML(
      "beforeend",
      this._createWidgetTemplate()
    );

    this._popupElement = this._rootElement.querySelector(`.${ECssClass.Popup}`);
    this._popupLayoutElement = this._popupElement.querySelector(
      `.${ECssClass.PopupLayout}`
    );
    this._formElement = this._popupElement.querySelector(
      `.${ECssClass.PopupForm}`
    );
    this._popupContentElement = this._popupElement.querySelector(
      ".fortune-popup__content"
    );
    this._spinnerContainerElement = this._popupElement.querySelector(
      ".fortune-popup__spinner-container"
    );
    this._spinButtonElement = this._popupElement.querySelector(
      SPINNER_TRIGGER_SELECTOR
    );
    this._inputElements = Array.from(
      this._formElement.querySelectorAll(".input__field")
    );

    this._inputElements.forEach((el) => {
      el.addEventListener("invalid", () =>
        setTimeout(() => {
          el.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        }, 100)
      );
    });

    this._phoneInputElement = this._popupElement.querySelector(
      "#phone"
    ) as HTMLInputElement;

    this._mask = IMask(this._phoneInputElement, {
      mask: "+7 (000) 000-00-00",
    });

    this._phoneInputElement.addEventListener("input", () => {
      this._phoneInputElement.setCustomValidity("");
      if (this._mask.unmaskedValue === "8") {
        this._mask.value = "+7";
      }
    });

    this._setupEventListeners();
    this._renderFortuneWheel();
  }

  render() {
    this._init();

    this._popupLayoutElement.addEventListener("touchmove", (evt) =>
      evt.preventDefault()
    );

    setTimeout(() => {
      this._popupElement.classList.add(ECssClass.PopupOpen);
    }, 10);
  }

  close() {
    this._popupElement.remove();
    this._popupElement.classList.remove(ECssClass.PopupOpen);
  }

  _onFormSubmit(evt: FormDataEvent) {
    evt.preventDefault();
    this._phoneInputElement.setCustomValidity("");

    if (this._phoneInputElement.value.length !== 18) {
      return this._phoneInputElement.setCustomValidity(
        "Проверьте формат номера телефона"
      );
    }

    this._spinButtonElement.disabled = true;
    this._inputElements.forEach((elem) => (elem.disabled = true));

    const wonPrize = this._fortuneWheel.prepareWheel();

    const data = JSON.stringify({
      name: this._widgetName,
      prize: wonPrize.amoText,
      ...this._inputElements.reduce((acc, elem) => {
        return { ...acc, [elem.name]: elem.value };
      }, {}),
    });

    fetch(this._backendUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    }).then(() => {
      this._popupContentElement.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => this._fortuneWheel.spin(), 300);
    });
  }

  _setupEventListeners() {
    this._popupLayoutElement.addEventListener("click", this.close);
    this._spinButtonElement.addEventListener("click", () => {
      this._formElement.requestSubmit();
    });
    this._formElement.addEventListener("submit", this._onFormSubmit);
  }

  _createWinTemplate(text: string) {
    return `
      <div class="win">
        <h2 class="win__title">Поздравляем!<br />Вы выиграли приз <span class="win__item">"${text}"</span></h2>
        <p class="win__operator">Скоро с вами свяжется оператор</p>
        <button class="win__button button">Крутить ещё раз</button>
      </div>
    `.trim();
  }

  _createWidgetTemplate() {
    return `
      <div class="fortune-popup">
        <div class="fortune-popup__layout"></div>
        <div class="fortune-popup__content">
          <div class="fortune-popup__header">
            <h2 class="fortune-popup__title">Испытайте удачу</h2>
            <p class="fortune-popup__text">Выиграйте <span class="fortune-popup__highlight-text">3000₽</span> на лазерную эпиляцию <br class="fortune-popup__header-br">или другие призы<span class="fortune-popup__highlight-text">*</span></p>
          </div>
          <div class="fortune-popup__spinner-container">
            <div id="spinner" class="fortune-popup__spinner"></div>
            ${this._createFormTemplate()}
          </div>
        </div>
      </div>  
    `.trim();
  }

  _renderTriggerButton() {
    document
      .querySelector(this._triggerSelector)
      .insertAdjacentHTML("afterbegin", this._createTriggerButtonTemplate());
  }

  _createTriggerButtonTemplate() {
    return `
        ${icon}
        <p class="widget-trigger__text">Испытайте удачу!</p>
    `;
  }

  _createFormTemplate() {
    return `
    <form class="fortune-popup__form">
      <div class="fortune-popup__inputs">
        <div class="input">
        <label class="input__label" for="name">Имя</label>
        <input id="name" name="fio" class="input__field" type="text" placeholder="Ваше имя" required>
      </div>              
        <div class="input">
          <label class="input__label" for="phone">Телефон</label>
          <input id="phone" name="phone" class="input__field" type="text" inputmode="numeric" placeholder="+7 (000) 000-00-00" required>
        </div>              
        <div class="input">
          <label class="input__label" for="city">Город</label>
          <input id="city" name="city" class="input__field" type="text" placeholder="Москва" required>
        </div>
        <p class="fortune-popup__disclaimer">
          <span class="fortune-popup__highlight-text">*</span> Предложение действует только для новых клиентов.
        </p>
      </div>
      <button class="fortune-popup__trigger button">Крутить барабан</button>
    </form>
    `.trim();
  }

  _onSpinMoreBtnClick() {
    this._spinnerContainerElement.removeChild(
      this._spinnerContainerElement.children[1]
    );
    this._spinnerContainerElement.insertAdjacentHTML(
      "beforeend",
      this._createFormTemplate()
    );
    this._formElement = this._popupElement.querySelector(
      `.${ECssClass.PopupForm}`
    );
    this._spinButtonElement = this._popupElement.querySelector(
      SPINNER_TRIGGER_SELECTOR
    );
    this._inputElements = Array.from(
      this._formElement.querySelectorAll(".input__field")
    );
    this._phoneInputElement = this._formElement.querySelector(
      "#phone"
    ) as HTMLInputElement;

    this._inputElements.forEach((el) => {
      el.addEventListener("invalid", () =>
        setTimeout(() => {
          el.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        }, 100)
      );
    });

    this._mask = IMask(this._phoneInputElement, {
      mask: "+7 (000) 000-00-00",
    });

    this._phoneInputElement.addEventListener("input", () => {
      this._phoneInputElement.setCustomValidity("");
      if (this._mask.unmaskedValue === "8") {
        this._mask.value = "+7";
      }
    });

    this._formElement.addEventListener("submit", this._onFormSubmit);
  }

  _onSpinStart() {
    console.log("Запуск колеса");
  }

  _onSpinEnd(prize: TPrize) {
    if (window.innerWidth <= 768) {
      this._popupContentElement.scrollTo({ top: 100, behavior: "smooth" });
    }
    const { fullText, url } = prize;
    this._spinnerContainerElement.removeChild(
      this._spinnerContainerElement.children[1]
    );
    this._spinnerContainerElement.insertAdjacentHTML(
      "beforeend",
      this._createWinTemplate(fullText)
    );
    this._spinMoreBtnElement = this._popupElement.querySelector(".win__button");
    this._spinMoreBtnElement.addEventListener(
      "click",
      this._onSpinMoreBtnClick
    );
    console.log("выигрыш: " + prize.text);

    // @ts-ignore
    startConfetti(".fortune-popup__content");
    // @ts-ignore
    setTimeout(stopConfetti, 3000);
  }

  _renderFortuneWheel() {
    this._fortuneWheel = new FortuneWheel({
      ...MOCK_WHEEL_PROPS,
      onSpinStart: this._onSpinStart,
      onSpinEnd: this._onSpinEnd,
      prizes: this._prizes,
    });
    this._fortuneWheel.render();
  }
}
