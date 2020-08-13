declare type TagGroups = {
  [id: string]: {
    name: string;
    color: string;
  };
};

declare type Tags = {
  [id: string]: {
    name: string;
    group: keyof TagGroups;
  };
};

declare type Config = {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  tagGroups: TagGroups;
  tags: Tags;
};

declare const config: Config;
export default config;
