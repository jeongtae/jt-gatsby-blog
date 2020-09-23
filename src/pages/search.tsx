import React, { useState, useRef, useEffect, useCallback } from "react";
import { PageProps, graphql } from "gatsby";
import BasePageFC from "../components/BasePageFC";
import { debounce } from "lodash";
import oc from "open-color";
import styled from "styled-components";
import { MarkdownRemark } from "../generated/graphql-types";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import PostList from "../components/PostList";

const SearchResultText = styled.p`
  margin: 32px 0 16px;
  padding: 0;
  text-align: center;
  font-size: 0.16rem;
  font-weight: 500;
  color: ${oc.gray[7]};
`;

const SearchPage: BasePageFC<{
  posts: {
    nodes: MarkdownRemark[];
  };
}> = ({ data, location, navigate, transitionStatus }) => {
  const posts = data.posts.nodes;
  const filterPosts = query =>
    posts.filter(post => {
      const title = post.frontmatter.title?.replace(" ", "").toLowerCase() ?? "";
      const queries: string[] = query.split(" ").filter(q => q);
      for (const query of queries) {
        if (title.indexOf(query) < 0) {
          return false;
        }
      }
      return true;
    });

  const [query, setQuery] = useState(new URLSearchParams(location.search).get("query") || "");

  const [resultPosts, setResultPosts] = useState<MarkdownRemark[]>(query ? filterPosts(query) : []);
  const setResultPostsDebounced = useCallback(
    debounce((query: string) => setResultPosts(filterPosts(query)), 800),
    []
  );

  return (
    <Layout
      className={transitionStatus}
      navigationProps={{
        showSearchInput: true,
        searchInputValue: query,
        onChangeSearchInput: ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
          setResultPosts(null);
          setQuery(value);
          value = value.trim();
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
      {query.trim() ? (
        <>
          <SearchResultText>
            {resultPosts
              ? resultPosts.length
                ? `${resultPosts.length}개의 결과`
                : "결과 없음"
              : "검색 중"}
          </SearchResultText>
          <PostList posts={resultPosts || []} />
        </>
      ) : (
        <SearchResultText>검색어를 입력하세요.</SearchResultText>
      )}
    </Layout>
  );
};
export default SearchPage;

export const query = graphql`
  query {
    posts: allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
      nodes {
        id
        excerpt(truncate: true, pruneLength: 180)
        timeToRead
        fields {
          slug
        }
        frontmatter {
          title
          description
          date(formatString: "YYYY-MM-DD")
          tags
          thumbnail {
            childImageSharp {
              fixed(width: 78, height: 78, fit: COVER) {
                ...GatsbyImageSharpFixed_withWebp_noBase64
              }
            }
          }
        }
      }
    }
  }
`;
