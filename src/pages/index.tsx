import React from "react";
import { PageProps, Link, graphql } from "gatsby";
import styled from "styled-components";
import { MarkdownRemark, Tag, TagGroup } from "../generated/graphql-types";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import PostList from "../components/PostList";
import TagList, { ListItem as TagListItem } from "../components/TagList";

const ListHeader = styled.h2`
  margin: 0.32rem 0.03rem 0.16rem;
  font-size: 0.32rem;
`;

const TagGroupList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
const TagGroupListItem = styled.li`
  h3 {
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

const IndexPage: React.FC<PageProps<PageData>> = ({ data, location, navigate }) => {
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

  const labelClickHandler: React.MouseEventHandler<HTMLLabelElement> = e => {
    e.preventDefault();
    e.currentTarget.control?.click();
  };

  return (
    <Layout>
      <SEO />
      <ListHearder>태그</ListHearder>
      <TagGroupList>
        <TagListItem>
          <input
            type="checkbox"
            name="tag"
            id="all"
            checked={!selectedTag}
            onChange={e => e.currentTarget.checked && navigate(`.`)}
          />
          <label className="control" htmlFor="all" onClick={labelClickHandler}>
            전체 ({posts.length})
          </label>
        </TagListItem>
        {tagGroups.map(tagGroup => (
          <TagGroupListItem key={tagGroup.id}>
            <h3>{tagGroup.name}</h3>
            <TagList
              tags={tagGroup.tags}
              selectedTagSlugs={selectedTag ? [selectedTag.slug] : []}
              onChangeSelectedTagSlug={(slug, selected) => {
                if (selected) {
                  navigate(`/?tag=${slug}`);
                }
              }}
            />
          </TagGroupListItem>
        ))}
      </TagGroupList>
      <ListHeader>{selectedTag ? `${selectedTag.name} 포스트` : "모든 포스트"}</ListHeader>
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
                ...GatsbyImageSharpFluid_withWebp_noBase64
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
