const { default: userConfig } = require("./contents/configs/config");

const siteMetadata = { ...userConfig };
delete siteMetadata["tag"];
delete siteMetadata["tagGroups"];

const { siteUrl } = siteMetadata;

const config = {
  siteMetadata,
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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: userConfig.googleAnalyticsTrackingId,
        exclude: ["/search"],
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        tableOfContents: {
          absolute: false,
          maxDepth: 3,
        },
        plugins: [
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              isIconAfterHeader: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 960,
              backgroundColor: "transparent",
              quality: 85,
              withWebp: true,
              srcSetBreakpoints: [600, 740, 960, 1200, 1440, 1920],
              // wrapperStyle(fluid) {
              //   return `margin: 0 -1.2rem`;
              // },
            },
          },
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 800,
              ratio: 16 / 9,
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              urlOverrides: [
                {
                  id: "youtube",
                  embedURL: videoId => `https://www.youtube-nocookie.com/embed/${videoId}`,
                },
              ], //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
              // containerClass: "embedVideo-container", //Optional: Custom CSS class for iframe container, for multiple classes separate them by space
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: `language-`,
              showLineNumbers: true,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              // wrapperStyle: `margin-bottom: 1.7rem`,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir({ hash, name }) {
                return `downloads/${hash}/${name}`;
              },
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`],
            },
          },
        ],
      },
    },
    {
      // automatically generate typings from graphql schema
      resolve: `gatsby-plugin-generate-typings`,
      options: {
        dest: `./src/generated/graphql-types.d.ts`,
      },
    },
  ],
};

if (process.env.NODE_ENV === `development`) {
  filesystemPluginIndex = config.plugins.findIndex(c => c.resolve === `gatsby-source-filesystem`);
  config.plugins.splice(filesystemPluginIndex, 0, {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `drafts`,
      path: `${__dirname}/contents/drafts`,
    },
  });
}

module.exports = config;
