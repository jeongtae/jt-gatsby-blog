const isDebug = process.env["NODE_ENV"] === "development";

const config = {
  title: "JTK Blog",
  author: "김정태",
  description: "김정태의 블로그입니다.",
  siteUrl: !isDebug ? "https://blog.jeongtae.com" : "http://localhost:8000",
  googleAnalyticsTrackingId: "UA-171140784-1",
  facebookAppId: "352465815881581",
  tags: {
    category: {
      name: "카테고리",
      color: "red",
      tags: {
        lecture: "강의",
        diy: "DIY",
        web: "웹",
        game: "게임",
        "graphic-design": "그래픽 디자인",
        portfolio: "포트폴리오",
      },
    },
    comlang: {
      name: "컴퓨터 언어",
      color: "orange",
      tags: {
        html: "HTML",
        css: "CSS",
        "objective-c": "Objective-C",
        csharp: "C#",
      },
    },
    framework: {
      name: "프레임워크",
      color: "green",
      tags: {
        react: "React",
        svelte: "Gatsby",
        "source-engine": "소스 엔진",
        spritekit: "SpriteKit",
      },
    },
    software: {
      name: "소프트웨어",
      color: "blue",
      tags: {
        "fusion-360": "퓨전 360",
        "3ds-max": "3ds Max",
        photoshop: "포토샵",
        metasequoia: "메타세콰이어",
        "hammer-editor": "해머 에디터",
      },
    },
    hardware: {
      name: "하드웨어",
      color: "violet",
      tags: {
        "raspberry-pi": "라즈베리 파이",
        arduino: "아두이노",
        overclocking: "오버클럭",
      },
    },
    game: {
      name: "게임",
      color: "grape",
      tags: {
        "sudden-attack": "서든어택",
        "sudden-attack-skin": "서든어택 스킨",
        "maple-story": "메이플스토리",
        "cs:s": "CS:S",
        "cs:s-skin": "CS:S 스킨",
        "cs:go": "CS:GO",
      },
    },
  },
  portfolios: {
    development: {
      name: "개발",
      color: "pink",
      tags: ["web"],
    },
    diy: {
      name: "DIY",
      color: "orange",
      tags: ["web"],
    },
    game: {
      name: "게임",
      color: "blue",
      tags: ["game"],
    },
    design: {
      name: "디자인",
      color: "lime",
      tags: ["graphic-design"],
    },
  },
};

module.exports.default = config;
