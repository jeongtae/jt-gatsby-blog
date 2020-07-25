const isDebug = process.env["NODE_ENV"] === "development";

const config = {
  /* Site Metadata */
  title: "정태 블로그",
  description: "김정태의 블로그입니다.",
  siteUrl: !isDebug ? "https://blog.jeongtae.com" : "http://localhost:8000",
  /* Tag Groups */
  tagGroups: {
    proglang: { name: "Programming Language", color: "red" },
    framework: { name: "Framework", color: "red" },
  },
  /* Tags */
  tags: {
    javascript: { name: "JavaScript", group: "proglang" },
    javascript: { name: "JavaScript", group: "proglang" },
    python: { name: "Python", group: "proglang" },
    react: { name: "React", group: "framework" },
    svelte: { name: "Svelte", group: "framework" },
    django: { name: "Django", group: "framework" },
  },
};

module.exports.default = config;
