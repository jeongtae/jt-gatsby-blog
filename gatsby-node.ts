import { resolve } from "path";
import { CreatePagesArgs, CreateNodeArgs, SourceNodesArgs, NodeInput } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import { intersection, difference, isEqual } from "lodash";
import config from "./contents/configs/config";

/* Make inversed the commented states of 2 lines below if you have a generated *.d.ts file */
import { Query } from "./src/generated/graphql-types";
// type Query = any;

declare type TagGroups = {
  [id: string]: {
    name: string;
    color: string;
  };
};

declare type Tags = {
  [id: string]: {
    name: string;
    group: keyof TagGroups;
  };
};

export function sourceNodes({ actions, createNodeId, createContentDigest }: SourceNodesArgs) {
  const { tags: configTags, portfolios: configPortfolios } = config;

  const tagGroups: TagGroups = {};
  const tags: Tags = {};

  Object.keys(configTags).forEach(tagGroupSlug => {
    const configTagGroup = configTags[tagGroupSlug];
    tagGroups[tagGroupSlug] = {
      name: configTagGroup.name,
      color: configTagGroup.color,
    };
    Object.keys(configTagGroup.tags).forEach(tagSlug => {
      const configTagName = configTagGroup.tags[tagSlug];
      tags[tagSlug] = { name: configTagName, group: tagGroupSlug };
    });
  });

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
      slug: tagGroupId,
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

  Object.keys(configPortfolios).forEach(portfolioSlug => {
    const configPortfolio = configPortfolios[portfolioSlug];
    const node: NodeInput = {
      id: createNodeId(`portfolio-${portfolioSlug}`),
      slug: portfolioSlug,
      name: configPortfolio.name,
      color: configPortfolio.color,
      tags___NODE: configPortfolio.tags.map(tagId => createNodeId(`tag-${tagId}`)),
      internal: {
        type: "Portfolio",
        contentDigest: createContentDigest(portfolioSlug),
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
              tags
              relatedTags
            }
          }
        }
      }
      allTag {
        nodes {
          slug
          group {
            slug
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

  const allRemark = data.allMarkdownRemark.edges.map(edge => edge.node);
  const allTag = data.allTag.nodes;
  const allCategoryTag = allTag.filter(tag => tag.group.slug === "category");
  const allCategoryTagSlug = allCategoryTag.map(({ slug }) => slug);
  for (const remark of allRemark) {
    const slug = remark.fields.slug;
    const tagSlugs = remark.frontmatter.tags ?? [];

    const partSlugs: string[] = [];
    const partNumber = getPartNumber(slug);
    if (partNumber >= 0) {
      const partTitle = getPartTitle(slug);
      const partRemarks = allRemark.filter(
        remark => getPartTitle(remark.fields.slug) === partTitle
      );
      partRemarks.forEach(remark => partSlugs.push(remark.fields.slug));
    }

    const categorySlugs: string[] = [];
    const categoryTagSlugs = intersection(tagSlugs, allCategoryTagSlug);
    if (categoryTagSlugs.length) {
      const categoryRemarks = allRemark.filter(testRemark => {
        const testCategoryTagSlugs = intersection(allCategoryTagSlug, testRemark.frontmatter.tags);
        return isEqual(categoryTagSlugs, testCategoryTagSlugs);
      });
      categoryRemarks.forEach(remark => categorySlugs.push(remark.fields.slug));
    }

    const relatedSlugs: string[] = [];
    const relatedTagSlugs = remark.frontmatter.relatedTags ?? [];
    const nonCategoryTagSlugs = difference(tagSlugs, allCategoryTagSlug);
    if (relatedTagSlugs.length) {
      const relatedRemarks = allRemark.filter(testRemark => {
        const testTagSlugs = testRemark.frontmatter.tags;
        const testSlug = testRemark.fields.slug;
        return slug !== testSlug && difference(relatedTagSlugs, testTagSlugs).length === 0;
      });
      relatedRemarks.forEach(remark => relatedSlugs.push(remark.fields.slug));
    } else if (nonCategoryTagSlugs.length) {
      let relatedRemarks = [...allRemark];
      for (const nonCategoryTagSlug of nonCategoryTagSlugs) {
        const newRelatedRemarks = relatedRemarks.filter(
          testRemark =>
            testRemark.frontmatter.tags?.includes(nonCategoryTagSlug) &&
            testRemark.fields.slug !== slug
        );
        if (newRelatedRemarks.length > 5 || relatedRemarks.length === allRemark.length) {
          relatedRemarks = newRelatedRemarks;
          continue;
        } else {
          break;
        }
      }
      if (relatedRemarks.length !== allRemark.length) {
        relatedRemarks.forEach(remark => relatedSlugs.push(remark.fields.slug));
      }
    }

    createPage({
      path: `/${slug}`,
      context: {
        slug,
        partSlugs,
        categorySlugs,
        relatedSlugs,
        categoryTagSlugs,
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
