import { IWidget, TPrize } from "./types";
import IMask from "imask";

import "./styles/style.css";
import "./styles/popup.css";

const FortuneWheel = (<any>window).FortuneWheel;

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

class Widget {
  _prizes: any;
  _rootSelector: string;
  _triggerSelector: string;

  _rootElement: HTMLElement;
  _triggerElement: HTMLElement;
  _popupLayoutElement: HTMLDivElement;
  _formElement: HTMLFormElement;

  _popupElement: HTMLDivElement;
  _fortuneWheel: any;

  constructor({ rootSelector, triggerSelector, prizes }: IWidget) {
    this._prizes = prizes;
    this._rootSelector = rootSelector;
    this._triggerSelector = triggerSelector;

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onSpinStart = this._onSpinStart.bind(this);
    this._onSpinEnd = this._onSpinEnd.bind(this);

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
    this._formElement = document.querySelector(`.${ECssClass.PopupForm}`);

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
  }

  open() {
    this._popupElement.classList.add(ECssClass.PopupOpen);
  }

  close() {
    this._popupElement.classList.remove(ECssClass.PopupOpen);
  }

  _onFormSubmit(evt: FormDataEvent) {
    evt.preventDefault();
  }

  _setupEventListeners() {
    this._popupLayoutElement.addEventListener("click", this.close);
    this._triggerElement.addEventListener("click", this.open);
    this._formElement.addEventListener("submit", this._onFormSubmit);
  }

  _createWidgetTemplate() {
    return `
      <div class="popup popup_open">
        <div class="popup__layout"></div>
        <div class="popup__content">
          <div class="popup__header">
            <h2 class="popup__title">Испытай удачу</h2>
            <p class="popup__text">Выиграйте <span class="popup__highlight-text">3000₽</span> на лазерную эпиляцию или другие призы</p>
          </div>
          <div class="popup__spinner-container">
            <div id="spinner" class="popup__spinner"></div>
            <form class="popup__form">
              <div class="input">
                <label class="input__label" for="name">Имя*</label>
                <input id="name" class="input__field" type="text" placeholder="John Doe">
              </div>              
              <div class="input">
                <label class="input__label" for="phone">Телефон*</label>
                <input id="phone" class="input__field" type="text" placeholder="+7 (000) 000-00-00">
              </div>              
              <div class="input">
                <label class="input__label" for="city">Город*</label>
                <input id="city" class="input__field" type="text" placeholder="Москва">
              </div>
              <button class="popup__trigger">Крутить барабан</button>
            </form>
          </div>
        </div>
      </div>  
    `.trim();
  }

  _onSpinStart() {
    console.log("Крутим!!!");
  }

  _onSpinEnd(prize: TPrize) {
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

(<any>window).Widget = Widget;
