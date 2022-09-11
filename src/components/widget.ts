import { IWidget, TPrize } from "../types";
import IMask from "imask";

import "../styles/style.css";
import "../styles/widget.css";
import FortuneWheel from "./wheel";

enum ECssClass {
  Popup = "popup",
  PopupOpen = "popup_open",
  PopupLayout = "popup__layout",
  PopupForm = "popup__form",
}

const SPINNER_ROOT_SELECTOR = "#spinner";
const SPINNER_TRIGGER_SELECTOR = ".popup__trigger";

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

  _rootElement: HTMLElement;
  _triggerElement: HTMLButtonElement;
  _popupLayoutElement: HTMLDivElement;
  _formElement: HTMLFormElement;
  _spinnerContainerElement: HTMLElement;
  _spinButtonElement: HTMLButtonElement;
  _inputElements: HTMLInputElement[];
  _spinMoreBtnElement: HTMLButtonElement;

  _popupElement: HTMLDivElement;
  _fortuneWheel: any;

  constructor({ rootSelector, triggerSelector, prizes, backendUrl }: IWidget) {
    this._prizes = prizes;
    this._rootSelector = rootSelector;
    this._triggerSelector = triggerSelector;
    this._backendUrl = backendUrl;

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
    this._spinnerContainerElement = this._popupElement.querySelector(
      ".popup__spinner-container"
    );
    this._spinButtonElement = this._popupElement.querySelector(
      SPINNER_TRIGGER_SELECTOR
    );
    this._inputElements = Array.from(
      this._formElement.querySelectorAll(".input__field")
    );

    const phoneInput = this._popupElement.querySelector(
      "#phone"
    ) as HTMLElement;

    IMask(phoneInput, {
      mask: "+{7} (000) 000-00-00",
    });

    this._setupEventListeners();
    this._renderFortuneWheel();
  }

  render() {
    this._init();

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
    this._spinButtonElement.disabled = true;
    this._inputElements.forEach((elem) => (elem.disabled = true));

    const wonPrize = this._fortuneWheel.prepareWheel();

    const data = JSON.stringify({
      name: "test widget",
      prize: wonPrize.text,
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
      this._fortuneWheel.spin();
    });
  }

  _setupEventListeners() {
    this._popupLayoutElement.addEventListener("click", this.close);
    this._formElement.addEventListener("submit", this._onFormSubmit);
  }

  _createWinTemplate({ text, url }: { text: string; url: string }) {
    return `
      <div class="win">
        <h2 class="win__title">Поздравляем! Вы выиграли приз <span class="win__item">"${text}"</span></h2>
        <a class="win__link" href="${url}" target="_blank" >Забрать приз</a>
        <button class="win__button button">Крутить ещё раз</button>
      </div>
    `.trim();
  }

  _createWidgetTemplate() {
    return `
      <div class="popup">
        <div class="popup__layout"></div>
        <div class="popup__content">
          <div class="popup__header">
            <h2 class="popup__title">Испытай удачу</h2>
            <p class="popup__text">Выиграйте <span class="popup__highlight-text">3000₽</span> на лазерную эпиляцию или другие призы</p>
          </div>
          <div class="popup__spinner-container">
            <div id="spinner" class="popup__spinner"></div>
            ${this._createFormTemplate()}
          </div>
        </div>
      </div>  
    `.trim();
  }

  _createFormTemplate() {
    return `
    <form class="popup__form">
      <div class="input">
        <label class="input__label" for="name">Имя*</label>
        <input id="name" name="fio" class="input__field" type="text" placeholder="John Doe" required>
      </div>              
      <div class="input">
        <label class="input__label" for="phone">Телефон*</label>
        <input id="phone" name="phone" class="input__field" type="text" placeholder="+7 (000) 000-00-00" required>
      </div>              
      <div class="input">
        <label class="input__label" for="city">Город*</label>
        <input id="city" name="city" class="input__field" type="text" placeholder="Москва" required>
      </div>
      <button class="popup__trigger button">Крутить барабан</button>
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
    this._formElement.addEventListener("submit", this._onFormSubmit);
    const phoneInput = this._formElement.querySelector("#phone") as HTMLElement;

    IMask(phoneInput, {
      mask: "+{7} (000) 000-00-00",
    });
  }

  _onSpinStart() {
    console.log("Крутим!!!");
  }

  _onSpinEnd(prize: TPrize) {
    const { text, url } = prize;
    this._spinnerContainerElement.removeChild(
      this._spinnerContainerElement.children[1]
    );
    this._spinnerContainerElement.insertAdjacentHTML(
      "beforeend",
      this._createWinTemplate({ text, url })
    );
    this._spinMoreBtnElement = this._popupElement.querySelector(".win__button");
    this._spinMoreBtnElement.addEventListener(
      "click",
      this._onSpinMoreBtnClick
    );
    console.log("выигрыш: " + prize.text);
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
