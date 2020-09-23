import React from "react";
import { graphql } from "gatsby";
import BasePageFC from "../components/BasePageFC";
import oc from "open-color";
import styled, { css } from "styled-components";
import { ApplyBreaks } from "../utils/styled-components";
import { difference } from "lodash";
import { MarkdownRemark, Tag, TagGroup } from "../generated/graphql-types";
// import Layout from "../components/Layout";
import SEO from "../components/SEO";
import PostList from "../components/PostList";
import TagList, { ListItem as TagListItem } from "../components/TagList";
import ToggleSwitch from "../components/ToggleSwitch";

const ListHeader = styled.h2`
  margin: 0.32rem 0.03rem 0.16rem;
  font-size: 0.32rem;
`;
const ListHeaderWithControl = styled.div`
  margin: 0.32rem 0.03rem 0.16rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    margin: 0;
    display: inline-block;
    font-size: 0.32rem;
  }
  ${ApplyBreaks(
    px => css`
      justify-content: start;
      .title {
        margin-right: 0.12rem;
      }
    `,
    ["sm"]
  )}
`;

const TagGroupList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
const TagGroupListItem = styled.li`
  h4 {
    margin: 8px;
    /* font-weight: 500; */
    font-size: 0.19rem;
  }
`;

const Message = styled.p`
  margin: 32px 0 16px;
  padding: 0;
  text-align: center;
  font-size: 0.16rem;
  font-weight: 500;
  color: ${oc.gray[7]};
`;

const IndexPage: BasePageFC<{
  posts: {
    nodes: MarkdownRemark[];
  };
  tags: {
    nodes: Tag[];
  };
  tagGroups: {
    nodes: TagGroup[];
  };
}> = ({ data, location, navigate, transitionStatus }) => {
  const {
    posts: { nodes: posts },
    tags: { nodes: tags },
    tagGroups: { nodes: tagGroups },
  } = data;
  const searchParams = new URLSearchParams(location.search);

  const searchParamTag = searchParams.get("tag")?.toLowerCase() || "";
  const searchParamTags = searchParams.get("tags")?.toLowerCase().split(" ") || [];
  const isTagMultiselectMode = !!searchParamTags.length;
  const selectedTags = [];
  if (isTagMultiselectMode) {
    searchParamTags.forEach(slug => {
      const tag = tags.find(tag => tag.slug === slug);
      tag && selectedTags.push(tag);
    });
  } else {
    const tag = tags.find(tag => tag.slug === searchParamTag);
    tag && selectedTags.push(tag);
  }
  const selectedTagSlugs = selectedTags.map(tag => tag.slug);

  const filteredPosts = selectedTags.length
    ? posts.filter(post => {
        const postTagSlugs = post.frontmatter.tags;
        return difference(selectedTagSlugs, postTagSlugs).length === 0;
      })
    : posts;

  const labelClickHandler: React.MouseEventHandler<HTMLLabelElement> = e => {
    e.preventDefault();
    e.currentTarget.control?.click();
  };

  return (
    <>
      <SEO />
      <ListHeaderWithControl>
        <h3 className="title">태그</h3>
        <ToggleSwitch
          text="다중선택"
          checked={isTagMultiselectMode}
          onChange={checked => {
            if (checked) {
              navigate(`.?tags=${selectedTagSlugs.join("+")}`);
            } else {
              const lastlySelectedTagSlug = selectedTagSlugs.length
                ? selectedTagSlugs[selectedTagSlugs.length - 1]
                : null;
              navigate(lastlySelectedTagSlug ? `.?tag=${lastlySelectedTagSlug}` : `.`);
            }
          }}
        />
      </ListHeaderWithControl>
      <TagGroupList>
        <TagListItem>
          <input
            type="checkbox"
            name="tag"
            id="all"
            checked={!selectedTags.length}
            onChange={e =>
              e.currentTarget.checked && navigate(isTagMultiselectMode ? `.?tags=` : `.`)
            }
          />
          <label className="control" htmlFor="all" onClick={labelClickHandler}>
            전체 ({posts.length})
          </label>
        </TagListItem>
        {tagGroups.map(tagGroup => (
          <TagGroupListItem key={tagGroup.id}>
            <h4>{tagGroup.name}</h4>
            <TagList
              tags={tagGroup.tags}
              selectedTagSlugs={selectedTagSlugs}
              onChangeSelectedTagSlug={(slug, selected) => {
                if (isTagMultiselectMode) {
                  const tagSlugs = [...selectedTagSlugs];
                  if (selected) {
                    tagSlugs.push(slug);
                  } else {
                    const indexToRemove = tagSlugs.findIndex(tagSlug => tagSlug === slug);
                    indexToRemove >= 0 && tagSlugs.splice(indexToRemove, 1);
                  }
                  navigate(`.?tags=${tagSlugs.join("+")}`);
                } else {
                  selected && navigate(`.`);
                  navigate(`/?tag=${slug}`);
                }
              }}
            />
          </TagGroupListItem>
        ))}
      </TagGroupList>
      <ListHeader>
        {selectedTags.length
          ? `${selectedTags.map(tag => tag.name).join(" ")} 포스트`
          : "모든 포스트"}
        {/* <TextSwitch
          defaultText="최신순"
          defaultIcon={faAngleUp}
          checkedText="오래된순"
          checkedIcon={faAngleDown}
        /> */}
      </ListHeader>
      {filteredPosts.length === 0 && <Message>포스트가 없습니다.</Message>}
      <PostList posts={filteredPosts} />
    </>
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
              fixed(width: 78, height: 78, fit: COVER, cropFocus: CENTER) {
                ...GatsbyImageSharpFixed_withWebp_noBase64
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
