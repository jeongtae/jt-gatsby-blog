const isDebug = process.env["NODE_ENV"] === "development";

const config = {
  title: "JTK 블로그",
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
        development: "개발",
        diy: "DIY",
        web: "웹",
        game: "게임",
        "graphic-design": "그래픽디자인",
        portfolio: "포트폴리오",
      },
    },
    comlang: {
      name: "컴퓨터 언어",
      color: "orange",
      tags: {
        html: "HTML",
        css: "CSS",
        javascript: "JavaScript",
        typescript: "TypeScript",
        graphql: "GraphQL",
        "objective-c": "Objective-C",
        csharp: "C#",
        python: "Python",
      },
    },
    framework: {
      name: "프레임워크",
      color: "green",
      tags: {
        react: "React",
        gatsby: "Gatsby",
        bootstrap: "Bootstrap",
        "source-engine": "소스엔진",
        spritekit: "SpriteKit",
        oracle: "Oracle",
        mysql: "MySQL",
        asp: "ASP",
        dotnet: ".NET",
        wpf: "WPF",
        pwa: "PWA",
        winform: "Windows Forms",
      },
    },
    software: {
      name: "소프트웨어",
      color: "blue",
      tags: {
        "fusion-360": "퓨전360",
        "3ds-max": "3ds Max",
        photoshop: "포토샵",
        metasequoia: "메타세콰이어",
        "hammer-editor": "해머에디터",
      },
    },
    hardware: {
      name: "하드웨어",
      color: "violet",
      tags: {
        "raspberry-pi": "라즈베리파이",
        arduino: "아두이노",
        overclock: "오버클럭",
        "3d-printer": "3D프린터",
        vr: "VR",
      },
    },
    game: {
      name: "게임",
      color: "grape",
      tags: {
        "kart-rider": "카트라이더",
        "sudden-attack": "서든어택",
        "sudden-attack-skin": "서든어택 스킨",
        "maple-story": "메이플스토리",
        "cs:s": "CS:S",
        "cs:s-skin": "CS:S 스킨",
        "cs:go": "CS:GO",
        "cs:go-map": "CS:GO 맵",
      },
    },
  },
  portfolios: {
    development: {
      name: "개발",
      color: "pink",
      tags: ["development"],
    },
    diy: {
      name: "DIY",
      color: "orange",
      tags: ["diy"],
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
