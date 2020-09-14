import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";
import oc from "open-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styled, { css, ApplyBreaks } from "../utils/styled-components";
import { MarkdownRemark, Tag } from "../generated/graphql-types";

const ITEM_HEIGHT = 88;

const List = styled.ul`
  margin: 0;
  display: grid;
  padding: 0;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
  ${ApplyBreaks(
    px => css`
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    `,
    ["md"]
  )}
  list-style: none;
`;
const ListItem = styled.li`
  margin: 0;
  height: ${ITEM_HEIGHT}px;
  min-height: 0.88rem;
  border-radius: 11px;
  overflow: hidden;
  article,
  a {
    border-radius: 11px;
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
    transition: background-color ease-in-out 200ms;
    a:visited .title {
      color: ${oc.gray[6]};
    }
    &:focus {
      box-shadow: 0 0 0 2px ${oc.orange[5]} inset;
    }
  }
  @media (hover) {
    a:hover {
      background-color: ${oc.gray[1]};
    }
  }
`;
const Thumbnail = styled.div`
  flex-shrink: 0;
  float: right;
  margin: 5px 5px 5px 0;
  width: ${ITEM_HEIGHT - 10}px;
  height: ${ITEM_HEIGHT - 10}px;
  background: ${oc.gray[3]};
  border-radius: 8px;
  overflow: hidden;
  .gatsby-image-wrapper {
    height: 100%;
  }
`;
const Contents = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 3px 8px;
  .title {
    flex-grow: 0;
    margin: 0;
    font-size: 0.17rem;
    /* height: 0.22rem; */
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .description {
    margin: 0;
    flex-grow: 0;
    color: ${oc.gray[7]};
    font-size: 0.13rem;
    /* height: 19rem; */
    margin-bottom: -3px;
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tags {
    flex-grow: 1;
    flex-basis: 0;
    margin: 0;
    margin-top: -2px;
    height: 100%;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    list-style: none;
    li {
      display: inline;
      margin: 0;
      color: ${oc.gray[7]};
      font-size: 0.13rem;
      font-weight: 300;
      &::before {
        content: "#";
        padding-left: 3px;
      }
    }
  }
  .additional {
    flex-grow: 0;
    display: flex;
    justify-content: space-between;
    color: ${oc.gray[7]};
    font-size: 0.13rem;
    font-weight: 400;
    time,
    p {
      margin: 0;
      display: flex;
      align-items: center;
    }
  }
  ${ApplyBreaks(
    px => css`
      .title {
        font-size: 0.15rem;
      }
      .description {
        font-size: 0.13rem;
      }
      .tags li {
        font-size: 0.12rem;
      }
    `,
    ["md"]
  )};
  ${ApplyBreaks(
    px => css`
      .title {
        font-size: 0.18rem;
      }
      .description {
        font-size: 0.14rem;
      }
      .tags li {
        font-size: 0.13rem;
      }
    `,
    ["lg"]
  )};
`;

const PostList: React.FC<{ posts: MarkdownRemark[] }> = ({ posts }) => {
  const query = useStaticQuery(graphql`
    query {
      allTag {
        nodes {
          name
          slug
          group {
            color
          }
        }
      }
    }
  `) as {
    allTag: {
      nodes: Tag[];
    };
  };
  const tags = query.allTag.nodes;

  return (
    <List>
      {posts.map(post => (
        <ListItem key={post.id}>
          <article>
            <Link to={`/${post.fields.slug}`} onMouseDown={e => e.preventDefault()}>
              {post.frontmatter.thumbnail && (
                <Thumbnail>
                  <Img fluid={post.frontmatter.thumbnail.childImageSharp.fluid} />
                </Thumbnail>
              )}
              <Contents>
                <h1 className="title">{post.frontmatter.title}</h1>
                <p className="description">{post.frontmatter.description || post.excerpt}</p>
                <ul className="tags">
                  {post.frontmatter.tags?.map((tagSlug, index) => (
                    <li key={index}>{tags.find(tag => tag.slug === tagSlug)?.name ?? tagSlug}</li>
                  ))}
                </ul>
                <div className="additional">
                  <time>
                    <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: "2px" }} />
                    <span>{post.frontmatter.date}</span>
                  </time>
                  <p>
                    <FontAwesomeIcon icon={faEye} style={{ marginRight: "2px" }} />
                    <span>약 {post.timeToRead}분</span>
                  </p>
                </div>
              </Contents>
            </Link>
          </article>
        </ListItem>
      ))}
    </List>
  );
};
export default PostList;
