import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import TransitionLink from "./TransitionLink";
import oc from "open-color";
import styled, { css } from "styled-components";
import { Tag, MarkdownRemark } from "../generated/graphql-types";

export const List = styled.ul`
  margin: 8px 0 3px;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;
export const ListItem = styled.li`
  margin: 0 0.02rem 0.06rem;
  display: inline-block;
  &:last-child {
    margin: 0 0.02rem 0.06rem;
  }
  input {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }
  label,
  a {
    width: 100%;
    height: 0.24rem;
    border: 1px solid ${oc.gray[7]};
    border-radius: 0.08rem;
    padding: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.13rem;
    font-weight: 300;
    color: ${oc.gray[7]};
    text-decoration: none;
    transition: background-color ease-in-out 150ms, color ease-in-out 150ms;
    cursor: pointer;
    &:visited {
      color: inherit;
    }
    &::before {
      content: "#";
      margin-right: 0.03rem;
      transition: color ease-in-out 150ms;
      color: ${oc.gray[7]};
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[2]};
      }
    }
  }
  input:focus + label,
  a:focus {
    outline: auto;
    outline-color: inherit;
  }
  input:checked + label,
  &.selected a {
    background-color: ${oc.gray[7]};
    color: white;
    &::before {
      color: white;
    }
  }
  ${Object.keys(oc).map(
    key => css`
      &.${key} {
        label,
        a {
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
        input:checked + label {
          background-color: ${oc[key][5]};
          color: white;
          &::before {
            color: white;
          }
        }
      }
      &.${key}.selected a {
        background-color: ${oc[key][5]};
        color: white;
        &::before {
          color: white;
        }
      }
    `
  )}
`;

const TagList: React.FC<{
  tags: Tag[];
  selectedTagSlugs?: string[];
  onChangeSelectedTagSlug?: (slug: string, selected: boolean) => void;
  type?: "checkbox" | "link" | "transitionlink";
  anchorHrefBuilder?: (slug: string) => string;
}> = ({
  tags,
  selectedTagSlugs = [],
  onChangeSelectedTagSlug = () => {},
  type = "checkbox",
  anchorHrefBuilder = () => "",
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

  const labelClickHandler: React.MouseEventHandler<HTMLLabelElement> = e => {
    e.preventDefault();
    e.currentTarget.control?.click();
  };

  return (
    <List>
      {type === "checkbox"
        ? tags?.map(tag => (
            <ListItem key={tag.slug} className={tag.group.color || ""}>
              <input
                type="checkbox"
                name="tag"
                id={tag.slug}
                checked={selectedTagSlugs.includes(tag.slug)}
                onChange={e => {
                  const {
                    currentTarget: { id, checked },
                  } = e;
                  onChangeSelectedTagSlug(id, checked);
                }}
              />
              <label htmlFor={tag.slug} onClick={labelClickHandler}>
                {tag.name} ({posts.filter(post => post.frontmatter.tags?.includes(tag.slug)).length}
                )
              </label>
            </ListItem>
          ))
        : tags?.map(tag => (
            <ListItem key={tag.slug} className={tag.group.color || ""}>
              {type === "link" ? (
                <Link
                  to={anchorHrefBuilder(tag.slug)}
                  key={tag.slug}
                  className={tag.group.color || ""}
                >
                  {tag.name} (
                  {posts.filter(post => post.frontmatter.tags?.includes(tag.slug)).length}
                </Link>
              ) : (
                <TransitionLink
                  to={anchorHrefBuilder(tag.slug)}
                  key={tag.slug}
                  className={tag.group.color || ""}
                >
                  {tag.name} (
                  {posts.filter(post => post.frontmatter.tags?.includes(tag.slug)).length}
                </TransitionLink>
              )}
            </ListItem>
          ))}
    </List>
  );
};

export default TagList;
