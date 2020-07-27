import React, { useState } from "react";
import { PageProps, Link, graphql } from "gatsby";
import { debounce } from "lodash";
import { MarkdownRemark } from "../generated/graphql-types";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import PostList from "../components/PostList";

type PageData = {
  posts: {
    edges: {
      node: MarkdownRemark;
    }[];
  };
};

const SearchPage: React.FC<PageProps<PageData>> = ({ data }) => {
  const posts = data.posts.edges.map(({ node: post }) => post);

  const [query, setQuery] = useState("");
  const [resultPosts, setResultPosts] = useState<MarkdownRemark[]>([]);

  return (
    <Layout>
      <SEO title="포스트 검색" />
      <input
        type="text"
        value={query}
        onChange={({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
          setQuery(value);
          const filteredPosts = posts.filter(
            post => post.frontmatter.title?.toLowerCase().indexOf(value) >= 0
          );
          setResultPosts(filteredPosts);
        }}
      />
      <p>{resultPosts.length}개의 결과</p>
      <PostList posts={resultPosts} />
    </Layout>
  );
};
export default SearchPage;

export const query = graphql`
  query {
    posts: allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
      edges {
        node {
          id
          excerpt(truncate: true, pruneLength: 200)
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
          }
        }
      }
    }
  }
`;
