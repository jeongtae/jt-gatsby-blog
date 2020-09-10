import React from "react";
import { PageProps, Link, graphql } from "gatsby";
import styled from "styled-components";
import { MarkdownRemark, Tag, TagGroup } from "../generated/graphql-types";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import PostList from "../components/PostList";
import TagList, { ListItem as TagListItem } from "../components/TagList";

const ListHeading = styled.h1`
  margin: 32px 3px 16px;
`;

const TagGroupList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
const TagGroupListItem = styled.li`
  h2 {
    margin: 8px;
    font-weight: 500;
    font-size: 0.19rem;
  }
`;

type PageData = {
  posts: {
    nodes: MarkdownRemark[];
  };
  tags: {
    nodes: Tag[];
  };
  tagGroups: {
    nodes: TagGroup[];
  };
};

const IndexPage: React.FC<PageProps<PageData>> = ({ data, location }) => {
  const {
    posts: { nodes: posts },
    tags: { nodes: tags },
    tagGroups: { nodes: tagGroups },
  } = data;
  const searchParams = new URLSearchParams(location.search);
  const selectedTagSlug = searchParams.get("tag")?.toLowerCase() || "";
  const selectedTag = tags.find(tag => tag.slug === selectedTagSlug);
  const filteredPosts = selectedTag
    ? posts.filter(post => post.frontmatter.tags.includes(selectedTag.slug))
    : posts;

  return (
    <Layout>
      <SEO />
      <ListHeading>태그</ListHeading>
      <TagGroupList>
        <TagListItem className={!selectedTag ? "highlighted" : ""}>
          <Link to=".">전체 ({posts.length})</Link>
        </TagListItem>
        {tagGroups.map(tagGroup => (
          <TagGroupListItem key={tagGroup.id}>
            <h2>{tagGroup.name}</h2>
            <TagList
              tags={tagGroup.tags}
              highlightedTagSlug={selectedTag ? selectedTag.slug : null}
            />
          </TagGroupListItem>
        ))}
      </TagGroupList>
      <ListHeading>{selectedTag ? `${selectedTag.name} 포스트` : "모든 포스트"}</ListHeading>
      <PostList posts={filteredPosts} />
    </Layout>
  );
};
export default IndexPage;

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
              fluid(maxWidth: 78, srcSetBreakpoints: [78, 156]) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
    tagGroups: allTagGroup {
      nodes {
        id
        name
        color
        tags {
          slug
          name
          group {
            color
          }
        }
      }
    }
    tags: allTag {
      nodes {
        name
        slug
        group {
          color
        }
      }
    }
  }
`;
