export interface IWebhook {
  content: null;
  embeds: {
    title: string;
    color: number;
    fields: {
      name: string;
      value: string;
    }[];
  }[];
  username: string;
  avatar_url: string;
}
