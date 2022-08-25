import { IWidget } from "./types";

import "./styles/style.css";
import "./styles/popup.css";

const FortuneWheel = (<any>window).FortuneWheel;

enum ECssClass {
  Popup = "popup",
  PopupOpen = "popup_open",
  PopupLayout = "popup__layout",
  PopupContent = "popup__content",
}

const SPINNER_ROOT_SELECTOR = "#spinner";
const SPINNER_TRIGGER_SELECTOR = ".popup__trigger";

const MOCK_WHEEL_PROPS = {
  size: 300,
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

  _popupElement: HTMLDivElement;
  _fortuneWheel: any;

  constructor({ rootSelector, triggerSelector, prizes }: IWidget) {
    this._prizes = prizes;
    this._rootSelector = rootSelector;
    this._triggerSelector = triggerSelector;

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
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

    this._setupEventListeners();
    this._renderFortuneWheel();
  }

  render() {
    this._init();
  }

  open() {
    console.log(this._popupElement);
    this._popupElement.classList.add(ECssClass.PopupOpen);
  }

  close() {
    this._popupElement.classList.remove(ECssClass.PopupOpen);
  }

  _setupEventListeners() {
    this._popupLayoutElement.addEventListener("click", this.close);
    this._triggerElement.addEventListener("click", this.open);
  }

  _createWidgetTemplate() {
    return `
      <div class="popup">
        <div class="popup__layout"></div>
        <div class="popup__content">
          <div id="spinner" class="popup__spinner"></div>
          <button class="popup__trigger">Крутить!</button>
        </div>
      </div>  
    `.trim();
  }

  _renderFortuneWheel() {
    this._fortuneWheel = new FortuneWheel({
      ...MOCK_WHEEL_PROPS,
      prizes: this._prizes,
    });
    this._fortuneWheel.render();
  }
}

(<any>window).Widget = Widget;
