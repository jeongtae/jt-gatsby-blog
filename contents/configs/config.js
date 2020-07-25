const isDebug = process.env["NODE_ENV"] === "development";

const config = {
  /* Site Metadata */
  title: "정태 블로그",
  description: "김정태의 블로그입니다.",
  siteUrl: !isDebug ? "https://blog.jeongtae.com" : "http://localhost:8000",
  },
};

module.exports.default = config;
