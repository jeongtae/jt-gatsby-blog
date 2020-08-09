import React, { useState, useRef, useEffect, useCallback } from "react";
import { PageProps, graphql } from "gatsby";
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

const SearchPage: React.FC<PageProps<PageData>> = ({ data, location, navigate }) => {
  const posts = data.posts.edges.map(({ node: post }) => post);
  const filterPosts = query => {
    return posts.filter(post => post.frontmatter.title?.toLowerCase().indexOf(query) >= 0);
  };

  const [query, setQuery] = useState(new URLSearchParams(location.search).get("query") || "");

  const [resultPosts, setResultPosts] = useState<MarkdownRemark[]>(query ? filterPosts(query) : []);
  const setResultPostsDebounced = useCallback(
    debounce((query: string) => setResultPosts(filterPosts(query)), 800),
    []
  );

  return (
    <Layout
      navigationProps={{
        showSearchInput: true,
        searchInputValue: query,
        onChangeSearchInput: ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
          setResultPosts([]);
          setQuery(value);
          if (value) {
            navigate(`./?query=${value}`, { replace: true });
            setResultPostsDebounced(value);
          } else {
            navigate(".", { replace: true });
          }
        },
      }}
    >
      <SEO title={query ? `${query} 검색` : "검색"} />
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
            tags
          }
        }
      }
    }
  }
`;
