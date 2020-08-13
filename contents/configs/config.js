const isDebug = process.env["NODE_ENV"] === "development";

const config = {
  /* Site Metadata */
  title: "정태 블로그",
  author: "김정태",
  description: "김정태의 블로그입니다.",
  siteUrl: !isDebug ? "https://blog.jeongtae.com" : "http://localhost:8000",
  googleAnalyticsTrackingId: "UA-171140784-1",
  /* Tag Groups */
  tagGroups: {
    category: { name: "카테고리", color: "red" },
    proglang: { name: "프로그래밍 언어", color: "blue" },
    framework: { name: "프레임워크", color: "violet" },
  },
  /* Tags */
  tags: {
    lecture: { name: "강의", group: "category" },
    tip: { name: "팁", group: "category" },
    diy: { name: "DIY", group: "category" },
    javascript: { name: "JavaScript", group: "proglang" },
    typescript: { name: "TypeScript", group: "proglang" },
    python: { name: "Python", group: "proglang" },
    csharp: { name: "C#", group: "proglang" },
    lua: { name: "Lua", group: "proglang" },
    react: { name: "React", group: "framework" },
    svelte: { name: "Svelte", group: "framework" },
    django: { name: "Django", group: "framework" },
  },
};

module.exports.default = config;
