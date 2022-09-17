export interface IWidget {
  rootSelector: string;
  triggerSelector: string;
  prizes: TPrize[];
  backendUrl: string;
  widgetName: string;
}

export type TPrize = {
  amoText: string;
  text: string;
  fullText: string;
  url: string;
  color: string;
  textColor: string;
};
