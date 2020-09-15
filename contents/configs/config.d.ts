declare type Tags = {
  [tagGroupSlug: string]: {
    name: string;
    color: string;
    tags: { [tagSlug: string]: string };
  };
};

declare type Config = {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  googleAnalyticsTrackingId: string;
  facebookAppId: string;
  tags: Tags;
};

declare const config: Config;
export default config;
