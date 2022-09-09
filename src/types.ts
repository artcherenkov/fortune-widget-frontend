export interface IWidget {
  rootSelector: string;
  triggerSelector: string;
  prizes: { color: string; text: string }[];
}

export type TPrize = {
  text: string;
  color: string;
  textColor: string;
};
