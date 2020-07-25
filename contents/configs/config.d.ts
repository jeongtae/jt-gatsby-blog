declare type Config = {
  title: string;
  description: string;
  siteUrl: string;
  tagGroups: TagGroups;
  tags: Tags;
};

declare const config: Config;
export default config;
