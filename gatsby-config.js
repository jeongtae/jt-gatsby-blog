module.exports = {
  siteMetadata: {
    title: "정태 블로그",
    description: "김정태의 블로그입니다.",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
          name: `posts`,
          path: `${__dirname}/posts`,
      },
    },
    `gatsby-transformer-remark`,
  ],
};
