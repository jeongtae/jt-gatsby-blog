import React, { useState, useEffect } from "react";
import { Link, PageProps, graphql } from "gatsby";
import styled, { css } from "styled-components";
import { breaks, ApplyBreaks } from "../utils/styled-components";
import oc from "open-color";
import { difference } from "lodash";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { ListItem as TagListItem } from "../components/TagList";
import { MarkdownRemark, Portfolio } from "../generated/graphql-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const LINE_WIDTH = 2;
const LINE_RADIUS = 18;
const DOT1_RADIUS = 24;
const DOT2_RADIUS = 10;

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

const TabButtonListItem = TagListItem;
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
  ${TabButtonListItem} a {
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
      margin: 0.32rem 0;
      padding: 0 12px;
      color: ${oc.gray[8]};
      transition: color 400ms ease-in-out;
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
        display: inline-flex;
        align-items: center;
        svg {
          margin-left: 0.05rem;
          transform: scale(0.8);
        }
      }
      p {
        margin: 0;
        margin-top: 0.05rem;
        padding: 0;
        color: ${oc.gray[6]};
        /* opacity: 0.8; */
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
        /* transition: background-color 400ms ease-in-out; */
        transition: inherit;
        transition-property: background-color;
      }
      ${Object.keys(oc).map(
        key =>
          css`
            &.${key} {
              color: ${oc[key][8]};
              &::before {
                background-color: ${oc[key][7]};
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
  allPortfolio: {
    nodes: Portfolio[];
  };
  allMarkdownRemark: {
    nodes: MarkdownRemark[];
  };
}>> = ({ data, location }) => {
  const portfolios = data.allPortfolio.nodes;
  const givenPortfolioSlug = location.hash?.slice(1) || "";
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio>(null);
  useEffect(() => {
    setCurrentPortfolio(portfolios.find(({ slug }) => slug === givenPortfolioSlug) || null);
  }, [givenPortfolioSlug]);
  const currentPortfolioSlug = currentPortfolio ? givenPortfolioSlug : "";

  let posts = data.allMarkdownRemark.nodes;

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
      <SEO title={currentPortfolio ? `${currentPortfolio.name} 포트폴리오` : "포트폴리오"} />
      <Title>포트폴리오</Title>
      <TabButtonList>
        <TabButtonListItem
          style={{ color: oc.gray[7] }}
          className={!currentPortfolio ? "selected" : ""}
        >
          <Link to={`.`}>전체</Link>
        </TabButtonListItem>
        {portfolios.map(portfolio => (
          <TabButtonListItem
            key={portfolio.slug}
            className={
              (portfolio.slug === currentPortfolioSlug ? "selected " : "") + portfolio.color
            }
          >
            <Link to={`#${portfolio.slug}`}>{portfolio.name}</Link>
          </TabButtonListItem>
        ))}
      </TabButtonList>
      <YearList>
        {years.map(year => (
          <YearListItem key={`year-${year}`}>
            <h2>{year}</h2>
            <ul>
              {postsGroupByYears[year].map(post => {
                let className = "";
                if (currentPortfolio) {
                  className =
                    difference(
                      currentPortfolio.tags.map(tag => tag.slug),
                      post.frontmatter.tags
                    ).length === 0
                      ? currentPortfolio.color
                      : "";
                }
                return (
                  <li key={post.fields.slug} className={className}>
                    <Link to={`/${post.fields.slug}`}>
                      <h3>
                        {post.frontmatter.title}
                        <FontAwesomeIcon icon={faAngleRight} />
                      </h3>
                      <p>{post.frontmatter.description || post.excerpt}</p>
                    </Link>
                  </li>
                );
              })}
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
    allPortfolio {
      nodes {
        slug
        name
        color
        tags {
          slug
        }
      }
    }
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
