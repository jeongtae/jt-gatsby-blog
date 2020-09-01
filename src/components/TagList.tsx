import React from "react";
import { Link, graphql, useStaticQuery } from "gatsby";
import oc from "open-color";
import styled, { css } from "../utils/styled-components";
import { Tag, MarkdownRemark } from "../generated/graphql-types";

export const List = styled.ul`
  margin: 0.8rem 0 0.3rem;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;
export const ListItem = styled.li`
  margin: 0 0.2rem 0.6rem;
  display: inline-block;
  a {
    width: 100%;
    height: 2.4rem;
    border: 0.1rem solid ${oc.gray[7]};
    border-radius: 0.8rem;
    padding: 0 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
    font-weight: 300;
    color: ${oc.gray[7]};
    text-decoration: none;
    transition: background-color ease-in-out 100ms, color ease-in-out 100ms;
    &::before {
      content: "#";
      margin-right: 0.3rem;
      transition: color ease-in-out 100ms;
      color: ${oc.gray[7]};
    }
    &:visited {
      color: ${oc.gray[7]};
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[2]};
      }
    }
  }
  &.highlighted a {
    background-color: ${oc.gray[7]};
    color: white;
    &::before {
      color: white;
    }
  }
  ${Object.keys(oc).map(
    key => css`
      &.${key} a {
        border-color: ${oc[key][5]};
        color: ${oc[key][5]};
        &::before {
          color: ${oc[key][5]};
        }
        @media (hover) {
          &:hover {
            background-color: ${oc[key][1]};
          }
        }
      }
      &.${key}.highlighted a {
        background-color: ${oc[key][5]};
        color: white;
        &::before {
          color: white;
        }
      }
    `
  )}
`;

const TagList: React.FC<{ tags: Tag[]; highlightedTagSlug?: string }> = ({
  tags,
  highlightedTagSlug,
}) => {
  const query = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter {
            tags
          }
        }
      }
    }
  `) as { allMarkdownRemark: { nodes: MarkdownRemark[] } };
  const posts = query.allMarkdownRemark.nodes;

  return (
    <List>
      {tags?.map(tag => (
        <ListItem
          key={tag.slug}
          className={[
            tag.group.color || "",
            highlightedTagSlug && highlightedTagSlug === tag.slug ? "highlighted" : "",
          ].join(" ")}
        >
          <Link to={`/?tag=${tag.slug}`} onMouseDown={e => e.preventDefault()}>
            {tag.name} ({posts.filter(post => post.frontmatter.tags?.includes(tag.slug)).length})
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default TagList;
