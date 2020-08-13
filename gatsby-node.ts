import { resolve } from "path";
import { CreatePagesArgs, CreateNodeArgs, SourceNodesArgs, NodeInput } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import config from "./contents/configs/config";

/* Make inversed the commented states of 2 lines below if you have a generated *.d.ts file */
// import { Query } from "./src/generated/graphql-types";
type Query = any;

export function sourceNodes({ actions, createNodeId, createContentDigest }: SourceNodesArgs) {
  const { tags, tagGroups } = config;

  Object.keys(tags).forEach(tagId => {
    const tag = tags[tagId];
    const node: NodeInput = {
      id: createNodeId(`tag-${tagId}`),
      slug: tagId,
      name: tag.name,
      group___NODE: createNodeId(`tagGroup-${tag.group}`),
      internal: {
        type: "Tag",
        contentDigest: createContentDigest(tagId),
      },
    };
    actions.createNode(node);
  });

  Object.keys(tagGroups).forEach(tagGroupId => {
    const tagGroup = tagGroups[tagGroupId];
    const node: NodeInput = {
      id: createNodeId(`tagGroup-${tagGroupId}`),
      name: tagGroup.name,
      color: tagGroup.color,
      tags___NODE: Object.keys(tags)
        .filter(tagId => tags[tagId].group === tagGroupId)
        .map(tagId => createNodeId(`tag-${tagId}`)),
      internal: {
        type: "TagGroup",
        contentDigest: createContentDigest(tagGroupId),
      },
    };
    actions.createNode(node);
  });
}

export async function createPages({ actions: { createPage }, graphql }: CreatePagesArgs) {
  const { data, errors } = await graphql<Query>(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `);
  if (errors) {
    throw errors;
  }

  const getPartNumber = (slug: string) => {
    const splits = slug.split("-");
    if (splits.length < 3) {
      return -1;
    }
    const numberString = splits[splits.length - 1];
    if (/^\d+$/g.test(numberString) === false) {
      return -1;
    }
    const number = parseInt(numberString);
    if (isNaN(number)) {
      return -1;
    }
    return number;
  };
  const getPartTitle = (slug: string) => {
    if (getPartNumber(slug) < 0) {
      return null;
    }
    const splits = slug.split("-");
    splits.splice(splits.length - 1, 1);
    return splits.join("-");
  };

  const remarks = data.allMarkdownRemark.edges.map(edge => edge.node);
  for (const remark of remarks) {
    const slug = remark.fields.slug;
    const parts: { slug: string; title: string }[] = [];
    const partNumber = getPartNumber(slug);
    if (partNumber >= 0) {
      const partTitle = getPartTitle(slug);
      const filteredParts = remarks.filter(
        remark => getPartTitle(remark.fields.slug) === partTitle
      );
      filteredParts.sort((part1, part2) => {
        const number1 = getPartNumber(part1.fields.slug);
        const number2 = getPartNumber(part2.fields.slug);
        if (number1 > number2) return 1;
        else if (number1 < number2) return -1;
        else return 0;
      });
      filteredParts.forEach(part =>
        parts.push({ slug: part.fields.slug, title: part.frontmatter.title })
      );
    }

    createPage({
      path: `/${slug}`,
      context: {
        slug,
        parts,
      },
      component: resolve("./src/templates/Post.tsx"),
    });
  }
}

export function onCreateNode({ node, actions: { createNodeField }, getNode }: CreateNodeArgs) {
  if (node.internal.type === "MarkdownRemark") {
    const path = createFilePath({ node, getNode }).normalize("NFC").replace("\\", "/");
    const paths = path.split("/").filter(x => x);
    const slug = paths.pop();
    createNodeField({
      node: node,
      name: "slug",
      value: slug,
    });
  }
}
