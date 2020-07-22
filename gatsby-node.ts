import { resolve } from "path";
import { CreatePagesArgs, CreateNodeArgs } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";

export async function createPages({ actions: { createPage }, graphql }: CreatePagesArgs) {
  const { data, errors } = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  if (errors) {
    throw errors;
  }

  const posts = (data as any).allMarkdownRemark.edges;
  const postTemplate = resolve("./src/templates/post.jsx");
  for (const { node } of posts) {
    createPage({
      path: node.fields.slug,
      context: {
        slug: node.fields.slug,
      },
      component: postTemplate,
    });
  }
}

export function onCreateNode({ node, actions: { createNodeField }, getNode }: CreateNodeArgs) {
  if (node.internal.type === "MarkdownRemark") {
    const path = createFilePath({ node, getNode }).normalize("NFC").replace("\\", "/");
    const paths = path.split("/").filter(x => x);
    const slug = "/" + paths.pop();
    createNodeField({
      node: node,
      name: "slug",
      value: slug,
    });
  }
}
