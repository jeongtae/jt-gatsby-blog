import React from "react";
import { PageProps, graphql } from "gatsby";
import { MarkdownRemarkFrontmatter } from "../generated/graphql-types";
import Layout from "../components/Layout";
import MarkdownSection from "../components/MarkdownSection";

type DataProps = {
  site: {
    siteMetadata: {
      title: string;
    }
  };
  post: {
    id: string;
    excerpt: string;
    html: string;
    frontmatter: MarkdownRemarkFrontmatter;
  };
};

const PostTemplate: React.FC<PageProps<DataProps>> = React.memo(props => {
  const {
    data: { site, post },
  } = props;
  return (
    <Layout>
      <h1>{site.siteMetadata.title}</h1>
      <h2>{post.frontmatter.title}</h2>
      <p>{post.excerpt}</p>
      <time>{post.frontmatter.date}</time>
      <MarkdownSection html={post.html} />
    </Layout>
  );
});
export default PostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
      }
    }
  }
`;
