import "../styles/wheel.css";
import { createPieSegmentsAngles } from "../utils/wheel";
import { TPrize } from "../types";

enum ECssClass {
  SpinnerContainer = "spinner-container",
  Spinner = "spinner",
  Ticker = "ticker",
  InnerCircle = "inner-circle",
  Prize = "prize",
}

interface IFortuneWheel {
  size: number;
  prizes: TPrize[];
  rootSelector: string;
  triggerSelector: string;

  onSpinStart?(): void;

  onSpinEnd?(prize: TPrize): void;
}

interface IPrizeElement {
  text: string;
  textColor: string;
  rotation: number;
}

export default class FortuneWheel {
  _size: number;
  _prizes: TPrize[];
  _sliceAngle: number;
  _angles: number[][] = [];
  _currentSliceIdx: number;
  _spinAnimation: number;
  _spinertia: number;

  _rootElement: HTMLElement;
  _spinnerContainerElement: HTMLDivElement;
  _spinnerElement: HTMLUListElement;
  _tickerElement: HTMLSpanElement;
  _innerCircleElement: HTMLSpanElement;
  _triggerElement: HTMLElement;
  _spinnerOverlayElement: HTMLElement;

  _spinnerElementStyles: CSSStyleDeclaration;
  _prizeElements: HTMLLIElement[] = [];

  _onSpinStart?(): void;

  _onSpinEnd?(prize: TPrize): void;

  constructor({
    size,
    prizes,
    rootSelector,
    triggerSelector,
    onSpinStart,
    onSpinEnd,
  }: IFortuneWheel) {
    this._size = size;
    this._prizes = prizes;

    this._rootElement = document.querySelector(rootSelector);
    this._triggerElement = document.querySelector(triggerSelector);

    this._onSpinEnd = onSpinEnd;
    this._onSpinStart = onSpinStart;

    this._spin = this._spin.bind(this);
    this._setEventListeners = this._setEventListeners.bind(this);
    this._onTransitionStart = this._onTransitionStart.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
  }

  render() {
    this._init();
  }

  _init() {
    this._sliceAngle = 360 / this._prizes.length;
    this._angles = createPieSegmentsAngles(this._prizes.length);

    this._createDOMTemplate();
    this._setEventListeners();

    this._spinnerElementStyles = window.getComputedStyle(this._spinnerElement);
    this._spinnerElement.style.background =
      "radial-gradient(50% 50% at 50% 50%,rgba(230, 255, 255, 0.4) 0%,rgba(217, 217, 217, 0) 100%)," +
      this._createConicGradientStyles();

    this._currentSliceIdx = this._getCurrentSliceIdx();
  }

  _spin() {
    const currentSliceIdx = this._getCurrentSliceIdx();

    if (currentSliceIdx !== this._currentSliceIdx) {
      this._currentSliceIdx = currentSliceIdx;
    }

    this._spinAnimation = requestAnimationFrame(this._spin);
  }

  _getCurrentSpinningAngle() {
    const values = this._spinnerElementStyles.transform
      .split("(")[1]
      .split(")")[0]
      .split(",");
    const a = values[0];
    const b = values[1];
    let rad = Math.atan2(Number(b), Number(a));

    if (rad < 0) rad += 2 * Math.PI;

    const angle = Math.round(rad * (180 / Math.PI));

    return angle === 360 ? 0 : angle;
  }

  _getCurrentSliceIdx() {
    const currentAngle = this._getCurrentSpinningAngle();

    return Math.floor(currentAngle / this._sliceAngle);
  }

  private _getSpinertia(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Возвращает угол, при котором указатель не попадает на границу между секторами */
  _createNonBoundaryRotation(): number {
    const rotation = Math.floor(
      Math.random() * 360 + this._getSpinertia(2000, 5000)
    );

    if (rotation % this._sliceAngle === 0) {
      return this._createNonBoundaryRotation();
    }

    return rotation;
  }

  _onTransitionStart() {
    this._onSpinStart && this._onSpinStart();
  }

  _onTransitionEnd() {
    cancelAnimationFrame(this._spinAnimation);
    this._spinnerElement.classList.remove("is-spinning");
    this._spinnerElement.style.transform = `rotate(${
      this._spinertia % 360
    }deg)`;
    this._spinnerOverlayElement.classList.remove("is-spinning");
    this._spinnerOverlayElement.style.transform = `rotate(${
      this._spinertia % 360
    }deg)`;

    this._spinertia = 0;

    const prize = this._prizes[this._getCurrentSliceIdx()];
    this._onSpinEnd && this._onSpinEnd(prize);
  }

  prepareWheel() {
    this._spinertia = this._createNonBoundaryRotation();

    // рассчитаем, какой приз выпадет
    const prizeIdx = Math.floor((this._spinertia % 360) / this._sliceAngle);
    return this._prizes[prizeIdx];
  }

  spin() {
    const rotateStyle = `rotate(${this._spinertia}deg)`;
    this._spinnerElement.style.transform = rotateStyle;
    this._spinnerOverlayElement.style.transform = rotateStyle;
    this._spinnerElement.classList.add("is-spinning");
    this._spinnerOverlayElement.classList.add("is-spinning");

    this._spin();
  }

  _setEventListeners() {
    this._spinnerElement.addEventListener(
      "transitionend",
      this._onTransitionEnd
    );
    this._spinnerElement.addEventListener(
      "transitionstart",
      this._onTransitionStart
    );
  }

  _createSpinnerContainerElement() {
    const element = document.createElement("div");
    element.classList.add(ECssClass.SpinnerContainer);

    return element;
  }

  _createSpinnerElement() {
    const element = document.createElement("ul");
    element.classList.add(ECssClass.Spinner);

    return element;
  }

  _createTickerElement() {
    const element = document.createElement("span");
    element.classList.add(ECssClass.Ticker);

    return element;
  }

  _createInnerCircleElement() {
    const element = document.createElement("span");
    element.classList.add(ECssClass.InnerCircle);

    return element;
  }

  _createSpinnerOverlayElement() {
    const element = document.createElement("span");
    element.classList.add("spinner-overlay");

    return element;
  }

  _createPrizeElement({ text, textColor, rotation }: IPrizeElement) {
    const element = document.createElement("li");
    const textElement = document.createElement("p");

    element.classList.add(ECssClass.Prize);
    textElement.classList.add("text");
    textElement.textContent = text;
    textElement.style.color = textColor;

    const fontSize: { [k: number]: number } = {
      2: 16,
      3: 16,
      4: 18,
      5: 18,
      6: 21,
      7: 21,
      8: 24,
      9: 24,
    };

    element.append(textElement);
    element.setAttribute("style", `--rotate: ${rotation}deg`);
    textElement.style.fontSize = `calc(var(--size) / ${
      fontSize[this._prizes.length]
    })`;

    return element;
  }

  _createPrizeElements() {
    return this._prizes.map(({ text, textColor }, idx) => {
      const rotation = -this._sliceAngle * idx - this._sliceAngle / 2;
      return this._createPrizeElement({ text, textColor, rotation });
    });
  }

  _createDOMTemplate() {
    this._spinnerContainerElement = this._createSpinnerContainerElement();
    this._spinnerElement = this._createSpinnerElement();
    this._tickerElement = this._createTickerElement();
    this._innerCircleElement = this._createInnerCircleElement();
    this._spinnerOverlayElement = this._createSpinnerOverlayElement();

    this._prizeElements = this._createPrizeElements();

    this._spinnerElement.append(...this._prizeElements);
    this._spinnerContainerElement.append(this._spinnerElement);
    this._spinnerContainerElement.append(this._tickerElement);
    this._spinnerContainerElement.append(this._innerCircleElement);
    this._spinnerContainerElement.append(this._spinnerOverlayElement);

    this._rootElement.append(this._spinnerContainerElement);
  }

  _createConicGradientStyles() {
    const sectors = this._angles.map(([a1, a2], idx) => {
      const isEvenPrizes = this._prizes.length % 2 === 0;

      const { color } = this._prizes[this._prizes.length - idx - 1];
      if (isEvenPrizes) {
        return `${color} ${a1}deg ${a2}deg`;
      }

      return `${color} ${a1}deg ${a2}deg`;
    });

    return `conic-gradient(from 90deg, ${sectors.join(", ")})`;
  }
}
