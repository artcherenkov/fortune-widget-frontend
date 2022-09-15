export interface IWidget {
  rootSelector: string;
  triggerSelector: string;
  prizes: TPrize[];
  backendUrl: string;
  widgetName: string;
}

export type TPrize = {
  text: string;
  fullText: string;
  url: string;
  color: string;
  textColor: string;
};

export enum ECssClass {
  Container = "wheel-container",
  Wheel = "wheel",
  Spinner = "spinner",
  Ticker = "ticker",
  SpinButton = "spin-button",
  IsSpinning = "is-spinning",
  Selected = "selected",
  Prize = "prize",
  Text = "text",
}

export interface IFortuneWheel {
  size: number;
  prizes: TPrize[];
  triggerSelector: string;

  onPrizeSelected(prize: TPrize): any;
}
