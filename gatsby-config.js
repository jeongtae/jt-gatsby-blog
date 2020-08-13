const { title, author, description, siteUrl } = require("./contents/configs/config").default;

module.exports = {
  siteMetadata: {
    title,
    author,
    description,
    siteUrl,
  },
  plugins: [
    `gatsby-plugin-lodash`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      sitemap: `${siteUrl}/sitemap.xml`,
      options: {
        host: siteUrl,
        policy: [{ userAgent: `*`, allow: [`/`] }],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        exclude: [`/search`],
        query: `
          query {
            allSitePage {
              nodes {
                path
                context {
                  slug
                }
              }
            }
          }
        `,
        resolveSiteUrl() {
          return siteUrl;
        },
        serialize({ allSitePage }) {
          return allSitePage.nodes.map(node => {
            const url = siteUrl + node.path;
            if (node.path === `/`) {
              // Root
              return { url, changefreq: `daily`, priority: 0.3 };
            } else if (node.context.slug) {
              // Posts
              return { url, changefreq: `weekly`, priority: 0.7 };
            } else {
              // Portfolio, About Me, ...
              return { url, changefreq: `daily`, priority: 0.5 };
            }
          });
        },
      },
    },
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
        name: `images`,
        path: `${__dirname}/contents/images/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
      resolve: `gatsby-plugin-generate-typings`,
      options: {
        dest: `./src/generated/graphql-types.d.ts`,
      },
    },
  ],
};
