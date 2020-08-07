import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import oc from "open-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styled, { css, ApplyBreaks } from "../utils/styled-components";
import { MarkdownRemark, TagEdge } from "../generated/graphql-types";

const List = styled.ul`
  margin: 0;
  display: grid;
  padding: 0;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${ApplyBreaks(
    px => css`
      grid-template-columns: repeat(2, minmax(0, 1fr));
    `,
    ["md"]
  )}
  gap: 0.25rem;
  list-style: none;
`;
const ListItem = styled.li`
  margin: 0;
  height: 6.5rem;
  border-radius: 0.667rem;
  overflow: hidden;
  article,
  a {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }
  a:hover {
    background-color: ${oc.gray[1]};
  }
`;
const Thumbnail = styled.img`
  flex-shrink: 0;
  float: right;
  margin: 0.3rem 0.3rem 0.3rem 0;
  width: ${6.5 - 0.6}rem;
  height: ${6.5 - 0.6}rem;
  background: ${oc.orange[4]};
  border-radius: 0.5rem;
  object-fit: cover;
`;
const Contents = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 0.2rem 0.5rem 0.5rem;
  .title {
    flex-grow: 0;
    margin: 0;
    font-size: 1.2rem;
    height: 1.5rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .description {
    margin: 0;
    flex-grow: 0;
    color: $oc-gray-7;
    font-size: 0.9rem;
    height: 1.2rem;
    margin-bottom: -0.2rem;
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tags {
    flex-grow: 1;
    flex-basis: 0;
    margin: 0;
    margin-top: 0.1rem;
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
      font-size: 0.8rem;
      font-weight: 300;
      &::before {
        content: "#";
        padding-left: 0.2rem;
      }
    }
  }
  .additional {
    flex-grow: 0;
    display: flex;
    justify-content: space-between;
    color: ${oc.gray[7]};
    font-size: 0.8rem;
    font-weight: 400;
    time,
    p {
      display: flex;
      align-items: center;
    }
  }
`;

const PostList: React.FC<{ posts: MarkdownRemark[] }> = ({ posts }) => {
  const query = useStaticQuery(graphql`
    query {
      tags: allTag {
        edges {
          node {
            name
            slug
            group {
              color
            }
          }
        }
      }
    }
  `) as {
    tags: {
      edges: TagEdge[];
    };
  };
  const {
    tags: { edges: tagEdges },
  } = query;

  return (
    <List>
      {posts.map(post => (
        <ListItem key={post.id}>
          <article>
            <Link to={post.fields.slug}>
              <Thumbnail alt="" src="#" />
              <Contents>
                <h1 className="title">{post.frontmatter.title}</h1>
                <p className="description">{post.excerpt}</p>
                <ul className="tags">
                  {post.frontmatter.tags.map(tagSlug => (
                    <li key={tagSlug}>
                      {tagEdges.find(edge => edge.node.slug === tagSlug).node.name}
                    </li>
                  ))}
                </ul>
                <div className="additional">
                  <time>
                    <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: "0.15rem" }} />
                    <span>{post.frontmatter.date}</span>
                  </time>
                  <p>
                    <FontAwesomeIcon icon={faEye} style={{ marginRight: "0.15rem" }} />
                    <span>약 {post.timeToRead}분 소요</span>
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
