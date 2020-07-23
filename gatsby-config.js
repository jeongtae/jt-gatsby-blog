const { title, description, siteUrl } = require("./contents/configs/config");

module.exports = {
  siteMetadata: {
    title,
    description,
    siteUrl,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/contents/posts/`,
      },
    },
    `gatsby-transformer-remark`,
    {
      // automatically generate typings from graphql schema
      resolve: "gatsby-plugin-generate-typings",
      options: {
        dest: "./src/generated/graphql-types.d.ts",
      },
    },
  ],
};
