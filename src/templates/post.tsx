import React from "react";
import { PageProps, graphql } from "gatsby";
import { MarkdownRemarkFrontmatter } from "../generated/graphql-types";
import Layout from "../components/layout";

type DataProps = {
  site: {
    siteMetadata: {
      title: string;
    }
  };
  markdownRemark: {
    id: string;
    excerpt: string;
    html: string;
    frontmatter: MarkdownRemarkFrontmatter;
  };
};

const PostTemplate: React.FC<PageProps<DataProps>> = React.memo(props => {
  const {
    data: { site, markdownRemark: post },
  } = props;
  return (
    <Layout>
      <h1>{site.siteMetadata.title}</h1>
      <h2>{post.frontmatter.title}</h2>
      <p>{post.excerpt}</p>
      <time>{new Date(post.frontmatter.date).toLocaleDateString("ko")}</time>
      <section dangerouslySetInnerHTML={{ __html: post.html }} />
      <code>
        <pre>{JSON.stringify(props, null, 4)}</pre>
      </code>
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
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
