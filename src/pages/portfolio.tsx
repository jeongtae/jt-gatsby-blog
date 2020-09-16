import React, { useState } from "react";
import { Link, PageProps, graphql } from "gatsby";
import styled, { ApplyBreaks, css, breaks } from "../utils/styled-components";
import oc from "open-color";
import { difference } from "lodash";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { ListItem as TagListItem } from "../components/TagList";
import { MarkdownRemark } from "../generated/graphql-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const LINE_WIDTH = 2;
const LINE_RADIUS = 18;
const DOT1_RADIUS = 24;
const DOT2_RADIUS = 10;

const tabs = [
  {
    id: "dev",
    name: "개발",
    color: "pink",
    tags: ["web"],
  },
  {
    id: "diy",
    name: "DIY",
    color: "orange",
    tags: ["web"],
  },
  {
    id: "game",
    name: "게임",
    color: "blue",
    tags: ["game"],
  },
];

const Title = styled.h1`
  margin: 0.32rem 0.03rem 0.32rem;
  font-size: 0.32rem;
  ${ApplyBreaks(
    px =>
      css`
        text-align: center;
      `,
    ["sm"]
  )};
`;

const TabButtonList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;

  flex-wrap: wrap;
  ${ApplyBreaks(
    px =>
      css`
        justify-content: center;
      `,
    ["sm"]
  )};
  ${TagListItem} a {
    padding: 0 8px;
    &::before {
      content: unset;
    }
  }
`;

const YearList = styled.ul`
  list-style: none;
  margin: 0 10px 10px;
  padding: 0;
  ${ApplyBreaks(
    px =>
      css`
        max-width: ${breaks["md"]}px;
        margin-left: auto;
        margin-right: auto;
      `,
    ["md"]
  )}
`;
const YearListItem = styled.li`
  margin: 0;
  padding: 30px 10px 24px;
  display: block;
  position: relative;
  &::before,
  &::after {
    content: "";
    display: block;
    position: absolute;
    border-color: ${oc.gray[7]};
    border-style: solid;
    border-width: 0;
    pointer-events: none;
  }
  &:nth-child(odd) {
    &::before {
      top: ${-LINE_WIDTH / 2}px;
      bottom: ${-LINE_WIDTH / 2 + LINE_RADIUS}px;
      left: ${-LINE_WIDTH / 2}px;
      right: calc(100% - ${-LINE_WIDTH / 2 + LINE_RADIUS}px);
      border-left-width: ${LINE_WIDTH}px;
      border-top-width: ${LINE_WIDTH}px;
      border-top-left-radius: ${LINE_RADIUS}px;
    }
    &::after {
      top: calc(100% - ${-LINE_WIDTH / 2 + LINE_RADIUS}px);
      bottom: ${-LINE_WIDTH / 2}px;
      left: -${LINE_WIDTH / 2}px;
      right: ${-LINE_WIDTH / 2 + LINE_RADIUS}px;
      border-left-width: ${LINE_WIDTH}px;
      border-bottom-width: ${LINE_WIDTH}px;
      border-bottom-left-radius: ${LINE_RADIUS}px;
    }
  }
  &:nth-child(even) {
    &::before {
      top: ${-LINE_WIDTH / 2}px;
      bottom: ${-LINE_WIDTH / 2 + LINE_RADIUS}px;
      right: ${-LINE_WIDTH / 2}px;
      left: calc(100% - ${-LINE_WIDTH / 2 + LINE_RADIUS}px);
      border-right-width: ${LINE_WIDTH}px;
      border-top-width: ${LINE_WIDTH}px;
      border-top-right-radius: ${LINE_RADIUS}px;
    }
    &::after {
      top: calc(100% - ${-LINE_WIDTH / 2 + LINE_RADIUS}px);
      bottom: ${-LINE_WIDTH / 2}px;
      right: -${LINE_WIDTH / 2}px;
      left: ${-LINE_WIDTH / 2 + LINE_RADIUS}px;
      border-right-width: ${LINE_WIDTH}px;
      border-bottom-width: ${LINE_WIDTH}px;
      border-bottom-right-radius: ${LINE_RADIUS}px;
    }
  }
  &:first-child::before {
    top: 42px;
    border-top-width: 0;
    border-top-left-radius: 0;
  }
  &:last-child {
    &::after {
      right: ${-DOT1_RADIUS / 2}px;
      left: unset;
      top: unset;
      bottom: 0;
      width: ${DOT1_RADIUS}px;
      height: ${DOT1_RADIUS}px;
      border: 0;
      border-radius: 100px;
      background-color: ${oc.white};
      box-shadow: 0 0 0 ${LINE_WIDTH}px ${oc.gray[7]} inset;
    }
    &:nth-child(odd)::after {
      left: ${-DOT1_RADIUS / 2}px;
      right: unset;
    }
  }
  > h2 {
    margin: 0;
    padding: 0 12px;
    font-size: 0.32rem;
    font-weight: 300;
    color: ${oc.gray[7]};
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: ${-DOT1_RADIUS / 2 - 10}px;
      right: ${-DOT1_RADIUS / 2 - 10}px;
      top: calc(0.19rem - ${DOT1_RADIUS}px / 2);
      width: ${DOT1_RADIUS}px;
      height: ${DOT1_RADIUS}px;
      border-radius: 100px;
      background-color: ${oc.white};
      box-shadow: 0 0 0 ${LINE_WIDTH}px ${oc.gray[7]} inset;
    }
  }
  &:nth-child(even) > h2::before {
    margin-left: auto;
  }
  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    > li {
      position: relative;
      margin: 0.22rem 0;
      padding: 0 12px;
      a {
        display: inline-block;
        padding: 3px 8px;
        margin: -3px -8px;
        border-radius: 8px;
        transition: background-color 150ms ease-in-out;
        &:link,
        &:visited {
          color: inherit;
        }
        @media (hover) {
          &:hover {
            background-color: ${oc.gray[1]};
          }
        }
      }
      h3 {
        margin: 0;
        padding: 0;
        font-size: 0.22rem;
        font-weight: 500;
        color: inherit;
        svg {
          margin-left: 0.05rem;
          transform: scale(0.8);
        }
      }
      p {
        margin:0;
        padding:0;
        /* color: ${oc.gray[6]}; */
        opacity: 0.7;
      }
      &::before {
        content: "";
        display: block;
        width: ${DOT2_RADIUS}px;
        height: ${DOT2_RADIUS}px;
        border-radius: 100px;
        background-color: ${oc.gray[7]};
        position: absolute;
        left: ${-DOT2_RADIUS / 2 - 10}px;
        right: ${-DOT2_RADIUS / 2 - 10}px;
        top: calc(0.12rem - ${DOT2_RADIUS}px / 2);
        z-index: 2;
      }
      ${tabs.map(
        tab =>
          css`
            &.${tab.color} {
              color: ${oc[tab.color][7]};
              &::before {
                background-color: ${oc[tab.color][7]};
              }
            }
          `
      )}
    }
  }
  &:nth-child(even) {
    text-align: end;
    &::before,
    > ul > li::before {
      margin-left: auto;
    }
  }
`;

const PortfolioPage: React.FC<PageProps<{
  allMarkdownRemark: {
    nodes: MarkdownRemark[];
  };
}>> = ({ data }) => {
  const givenTabId = location.hash?.slice(1) || "";
  const currentTabId = tabs.find(tab => tab.id === givenTabId) ? givenTabId : "";
  const currentTab = tabs.find(tab => tab.id === currentTabId);

  let posts = data.allMarkdownRemark.nodes;
  if (currentTab) {
    posts = posts.filter(post => difference(currentTab.tags, post.frontmatter.tags).length === 0);
  }

  const postsGroupByYears: { [id: string]: MarkdownRemark[] } = {};
  posts.forEach(post => {
    const date: string = post.frontmatter.date;
    const year: string = date.substring(0, 4);
    if (!postsGroupByYears[year]) {
      postsGroupByYears[year] = [];
    }
    postsGroupByYears[year].push(post);
  });
  const years: string[] = Object.keys(postsGroupByYears).sort().reverse();

  return (
    <Layout>
      <SEO title={currentTab ? `${currentTab.name} 포트폴리오` : "포트폴리오"} />
      <Title>포트폴리오</Title>
      <TabButtonList>
        <TagListItem style={{ color: oc.gray[7] }} className={!currentTab ? "selected" : ""}>
          <Link to={`.`}>전체</Link>
        </TagListItem>
        {tabs.map(tab => (
          <TagListItem
            key={tab.id}
            className={(tab.id === currentTabId ? "selected " : "") + tab.color}
          >
            <a href={`#${tab.id}`}>{tab.name}</a>
          </TagListItem>
        ))}
      </TabButtonList>
      <YearList>
        {years.map(year => (
          <YearListItem key={`year-${year}`}>
            <h2>{year}</h2>
            <ul>
              {postsGroupByYears[year].map(post => (
                <li
                  key={post.fields.slug}
                  className={
                    tabs.find(tab => difference(tab.tags, post.frontmatter.tags).length === 0)
                      ?.color || ""
                  }
                >
                  <Link to={`/${post.fields.slug}`}>
                    <h3>
                      {post.frontmatter.title}
                      <FontAwesomeIcon icon={faAngleRight} />
                    </h3>
                    <p>{post.frontmatter.description || post.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </YearListItem>
        ))}
      </YearList>
    </Layout>
  );
};
export default PortfolioPage;

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: "portfolio" } } }
      sort: { order: DESC, fields: frontmatter___date }
    ) {
      nodes {
        excerpt(truncate: true, pruneLength: 180)
        frontmatter {
          title
          description
          date
          tags
        }
        fields {
          slug
        }
      }
    }
  }
`;
