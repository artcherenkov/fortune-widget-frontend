export interface IWidget {
  rootSelector: string;
  triggerSelector: string;
  prizes: TPrize[];
}

export type TPrize = {
  text: string;
  url: string;
  color: string;
  textColor: string;
};
