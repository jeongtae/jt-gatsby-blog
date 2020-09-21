import React, { useRef, useEffect } from "react";
import { Link, PageProps, graphql } from "gatsby";
import Img from "gatsby-image/withIEPolyfill";
import oc from "open-color";
import copy from "copy-to-clipboard";
import styled, { css } from "styled-components";
import { ApplyBreaks, breaks } from "../utils/styled-components";
import { throttle } from "lodash";
import { SiteSiteMetadata, MarkdownRemarkFrontmatter, Tag, File } from "../generated/graphql-types";
import Layout, { ASIDE_BREAK } from "../components/Layout";
import TagList from "../components/TagList";
import MarkdownSection from "../components/MarkdownSection";
import SEO from "../components/SEO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faPlus,
  faShare,
  faBookmark,
  faStream,
  faTags,
  faAngleUp,
  faAngleDown,
  faAngleRight,
  faShareAlt,
  faCheckCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import FacebookShareLink from "../components/FacebookShareLink";
import TwitterShareLink from "../components/TwitterShareLink";
import MailShareLink from "../components/MailShareLink";

const Title = styled.h1`
  margin: 32px 8px 0;
  font-size: 0.35rem;
  font-weight: 300;
  ${ApplyBreaks(
    px => css`
      margin-top: 48px;
      text-align: center;
      font-size: 0.48rem;
    `,
    ["sm"]
  )};
`;

const Description = styled.p`
  margin: 16px 11px 0;
  color: ${oc.gray[7]};
  font-size: 0.14rem;
  font-weight: 300;
  ${ApplyBreaks(
    px => css`
      margin: 24px 10% 0;
      text-align: center;
      font-size: 0.16rem;
    `,
    ["sm"]
  )};
`;

const TagListBox = styled.div`
  margin: 16px 11px 0;
  display: flex;
  ${ApplyBreaks(
    px => css`
      margin-top: 21px;
      justify-content: center;
    `,
    ["sm"]
  )};
`;

const AdditionalBox = styled.div`
  margin: 8px 5px 40px;
  padding: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${oc.gray[4]};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  ${ApplyBreaks(
    px => css`
      margin-top: 32px;
    `,
    ["sm"]
  )};
`;

const Profile = styled.address`
  display: block;
  margin: 0;
  padding: 0;
  font-style: inherit;
  order: 2;
  ${ApplyBreaks(
    px => css`
      order: 0;
    `,
    ["sm"]
  )};
  a {
    width: fit-content;
    border-radius: 24px;
    padding: 4px;
    display: flex;
    align-items: center;
    text-decoration: none;
    font-weight: 300;
    transition: background-color 150ms ease-in-out;
    &:link {
      color: inherit;
    }
    &:visited {
      color: inherit;
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
      }
    }
    .image {
      width: 40px;
      height: 40px;
      margin: 0;
      padding: 0;
      border-radius: 50%;
      border: 2px solid white;
      background-color: ${oc.gray[1]};
    }
    .name {
      margin: 0;
      margin-left: 5px;
      margin-right: 10px;
    }
  }
`;

const Date = styled.time`
  order: 1;
  flex-basis: 100%;
  flex-grow: 1;
  display: block;
  margin: 0;
  margin-bottom: 8px;
  margin-left: 8px;
  padding: 0;
  font-style: inherit;
  color: ${oc.gray[6]};
  ul {
    display: flex;
    margin: 0;
    padding: 0;
    /* justify-content: flex-end; */
    list-style: none;
  }
  li {
    margin: 0;
    padding: 0;
    &::before {
      content: "\\30FB";
      margin: 0 2px;
    }
    &:first-child::before {
      content: unset;
      margin: 0;
    }
  }
  ${ApplyBreaks(
    px => css`
      margin-bottom: 0;
      flex-basis: unset;
      ul {
        /* justify-content: flex-start; */
      }
    `,
    ["sm"]
  )};
`;

const Buttons = styled.div`
  order: 3;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
  ${ApplyBreaks(
    px => css`
      margin-bottom: 0;
    `,
    ["sm"]
  )};
  button {
    border: none;
    border-radius: 8px;
    padding: 7px 5px;
    appearance: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0.14rem;
    font-weight: 500;
    margin: 0 0.03rem;
    color: ${oc.gray[7]};
    transition: 150ms ease-in-out;
    transition-property: background-color, color;
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
        color: ${oc.gray[9]};
      }
    }
    svg {
      margin-right: 0.04rem;
    }
  }
`;

const RelativeBlock = styled.div`
  position: relative;
`;

const DropdownOverlap = styled.div`
  position: absolute;
  background-color: ${oc.white};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
  justify-content: center;
  align-items: center;
  font-size: 0.14rem;
  font-weight: 500;
  cursor: default;
  color: ${oc.green[8]};
  &.show {
    display: flex;
  }
  svg {
    margin-right: 0.04rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background-color: ${oc.white};
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  width: 150px;
  height: fit-content;
  &.show {
    display: flex;
  }
  a {
    padding: 6px 0;
    width: calc(150px - 8px);
    border-bottom: 1px solid ${oc.gray[3]};
    font-size: 0.14rem;
    display: flex;
    align-items: center;
    &:link,
    &:visited {
      color: inherit;
    }
    &:last-of-type {
      border-bottom: none;
    }
    svg {
      padding-left: 3px;
      font-size: 0.18rem;
    }
    span {
      flex: 1;
      text-align: center;
      font-weight: 500;
    }
  }
  button {
    display: block;
    width: calc(150px - 8px);
    background-color: ${oc.gray[1]};
    margin: 4px;
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[2]};
      }
    }
  }
`;

const OriginalLink = styled.a.attrs(props => ({ target: "_blank" }))`
  &:link,
  &:visited {
    color: ${oc.gray[8]};
  }
  margin: 0 0 5px;
  color: ${oc.gray[8]};
  padding: 2px 4px;
  display: inline-flex;
  max-width: 95%;
  align-items: center;
  border-radius: 8px;
  transition: 150ms ease-in-out;
  transition-property: background-color, color;
  @media (hover) {
    &:hover {
      background-color: ${oc.gray[1]};
      color: ${oc.gray[9]};
    }
  }
  h2 {
    color: inherit;
    margin: 0;
    padding: 3px 4px;
    font-size: 0.12rem;
    font-weight: 500;
    border-radius: 3px;
    background-color: ${oc.gray[2]};
    flex-shrink: 0;
    /* flex: 1; */
  }
  span {
    color: inherit;
    margin: 0 4px;
    font-size: 0.14rem;
    /* flex: 0; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const AsideItemInMain = styled.section`
  margin: 38px -8px;
  &.responsive {
    ${ApplyBreaks(
      px => css`
        display: none;
      `,
      [ASIDE_BREAK]
    )};
  }
`;
const AsideItemInAside = styled.section`
  margin: 28px 8px;
  > p,
  > a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: end;
  }
  &:last-child {
    margin-bottom: 33vh;
  }
`;
const AsideItemHeader = styled.p`
  margin: 0 0 0.1rem;
  padding: 0 0.1rem;
  font-size: 0.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  a {
    border-radius: 8px;
    margin: 0 -0.1rem;
    padding: 0 0.1rem;
    transition: 150ms ease-in-out;
    transition-property: background-color, color;
    color: inherit;
    &:visited {
      color: inherit;
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
        color: ${oc.gray[9]};
        &::before {
          color: inherit;
        }
      }
    }
  }
  svg:last-child {
    font-size: 0.8em;
    margin-left: 0.04rem;
  }
  svg:first-child {
    margin-right: 0.06rem;
  }
`;
const AsideItemLinkHeader = AsideItemHeader.withComponent(Link);

const PartList = styled.ol`
  display: block;
  max-width: ${breaks["sm"]}px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: part-list;
`;
const Part = styled.li`
  margin: 3px 0;
  padding: 0;
  counter-increment: part-list;
  a {
    display: inline-flex;
    border-radius: 8px;
    padding: 3px 8px;
    text-decoration: none;
    align-items: center;
    font-size: 0.14rem;
    color: inherit;
    transition: 150ms ease-in-out;
    transition-property: background-color, color;
    &::before {
      content: counter(part-list);
      width: 19px;
      margin-left: -3px;
      margin-right: 1px;
      text-align: center;
      font-weight: 500;
      font-size: 0.13rem;
    }
    &:visited {
      color: ${oc.gray[6]};
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
        color: ${oc.gray[9]};
        &::before {
          color: inherit;
        }
      }
    }
  }
  &.highlighted {
    a:visited {
      color: ${oc.gray[9]};
    }
    font-weight: 500;
    a::before {
      content: "\\2022";
    }
  }
`;

const PostList = styled.ul`
  display: block;
  max-width: ${breaks["sm"]}px;
  margin: 0;
  padding: 0;
  list-style: none;
`;
const PostListItem = styled.li`
  margin: 3px 0;
  padding: 0;
  max-width: 340px;
  a {
    display: block;
    width: 100%;
    /* width: fit-content;
    max-width: 100%; */
    height: calc(0.39rem + 6px);
    border-radius: 8px;
    padding: 3px 8px;
    text-decoration: none;
    align-items: center;
    transition: 150ms ease-in-out;
    transition-property: background-color, color;
    &:link {
      color: inherit;
    }
    &:visited .title {
      color: ${oc.gray[6]};
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
        color: ${oc.gray[9]};
      }
    }
    .gatsby-image-wrapper {
      float: left;
      /* width: 0.39rem;
      height: 0.39rem; */
      border-radius: 6px;
      background-color: ${oc.gray[2]};
      margin-left: -5px;
      margin-right: 5px;
    }
    .title {
      display: block;
      margin: 0.02rem 0 0;
      font-size: 0.15rem;
      font-weight: 300;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .description {
      display: block;
      margin: 0;
      font-size: 0.12rem;
      font-weight: 300;
      color: ${oc.gray[6]};
    }
  }
  &.highlighted {
    .title {
      font-weight: 500;
    }
    a:visited .title {
      color: inherit;
    }
  }
`;

const CategoryList = styled.ul`
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
`;
const CategoryListItem = styled.li`
  margin: 3px 0;
  padding: 0;
  color: ${oc.gray[8]};
  font-size: 0.14rem;
  a {
    display: block;
    width: fit-content;
    max-width: 100%;
    color: inherit;
    transition: 150ms ease-in-out;
    transition-property: background-color, color;
    border-radius: 8px;
    padding: 3px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:visited {
      color: ${oc.gray[6]};
      svg,
      .text {
        color: inherit;
      }
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
        color: ${oc.gray[9]};
      }
    }
  }
  svg {
    display: inline-block;
    margin-right: 0.03rem;
  }
  .text {
    margin-right: 0.04rem;
    font-weight: 500;
  }
`;

const Toc = styled.div`
  ul {
    max-width: ${breaks["sm"]}px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    margin: 0;
    padding: 0;
    color: ${oc.gray[6]};
    font-weight: 300;
    &.highlighted {
      color: ${oc.gray[9]};
      font-weight: 500;
      > a::before,
      > p > a::before {
        content: "\\2022";
      }
    }
  }
  .nothing-highlighted & li {
    color: ${oc.gray[9]};
  }
  code {
    display: inline;
    font-size: inherit;
  }
  p {
    margin: 0;
    padding: 0;
  }
  a {
    border-radius: 8px;
    padding: 3px 8px;
    text-decoration: none;
    font-size: 0.14rem;
    color: inherit;
    transition: 150ms ease-in-out;
    transition-property: background-color, color;
    &::before {
      width: 19px;
      margin-left: -3px;
      margin-right: 6px;
      text-align: center;
      font-weight: 500;
    }
    &:link,
    &:visited {
      color: inherit;
    }
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
        color: ${oc.gray[9]};
        &::before {
          color: inherit;
        }
      }
    }
  }
  /* List H1 */
  > ul {
    counter-reset: toc-h1;
    > li {
      > a,
      > p > a {
        counter-increment: toc-h1;
        &::before {
          content: counter(toc-h1);
        }
      }
      /* List H2 */
      > ul {
        margin-left: 16px;
        counter-reset: toc-h2;
        > li {
          > a,
          > p > a {
            counter-increment: toc-h2;
            &::before {
              content: counter(toc-h2);
            }
          }
        }
      }
    }
  }
`;

interface MarkdownRemarkFrontmatterExtended extends MarkdownRemarkFrontmatter {
  dateFormal?: string;
  dateFromNow?: string;
}
type PageData = {
  site: {
    siteMetadata: SiteSiteMetadata;
  };
  post: {
    excerpt: string;
    html: string;
    tableOfContents: string;
    frontmatter?: MarkdownRemarkFrontmatterExtended;
  };
  partPosts: {
    nodes: {
      fields: { slug: string };
      frontmatter?: { title: string };
    }[];
  };
  categoryPosts: {
    nodes: {
      fields: { slug: string };
      frontmatter?: MarkdownRemarkFrontmatterExtended;
    }[];
  };
  recentPosts: {
    nodes: {
      fields: { slug: string };
      frontmatter?: MarkdownRemarkFrontmatterExtended;
    }[];
  };
  relatedPosts: {
    nodes: {
      fields: { slug: string };
      frontmatter?: MarkdownRemarkFrontmatterExtended;
    }[];
  };
  allTag: {
    nodes: Tag[];
  };
  profileFile: File;
};

const PostTemplate: React.FC<PageProps<PageData>> = ({ data, pageContext }) => {
  const {
    site,
    post,
    allTag,
    profileFile,
    partPosts: { nodes: partPosts },
    categoryPosts: { nodes: categoryPosts },
    recentPosts: { nodes: recentPosts },
    relatedPosts: { nodes: relatedPosts },
  } = data;
  const { slug, categoryTagSlugs } = pageContext as SitePageContext;
  const tags = allTag.nodes.filter(tag => post.frontmatter.tags?.includes(tag.slug));
  const tocRef = useRef<HTMLDivElement>();
  const markdownRef = useRef<HTMLElement>();

  const url = `${site.siteMetadata.siteUrl}/${slug}`;

  const currentIndexOfCategoryPosts = categoryPosts.findIndex(post => post.fields.slug === slug);
  const categoryPrevPost = categoryPosts[currentIndexOfCategoryPosts + 1];
  const categoryNextPost = categoryPosts[currentIndexOfCategoryPosts - 1];
  const currentCategoryTags = tags.filter(tag => categoryTagSlugs.includes(tag.slug));

  const copyDropdownRef = useRef<HTMLDivElement>();
  const shareDropdownRef = useRef<HTMLDivElement>();

  const PartListFragment = (
    <>
      <AsideItemHeader>
        <FontAwesomeIcon icon={faStream} />
        이어지는 글
      </AsideItemHeader>
      <PartList>
        {partPosts.map(post => (
          <Part key={post.fields.slug} className={post.fields.slug === slug ? "highlighted" : ""}>
            <Link to={`/${post.fields.slug}`}>{post.frontmatter.title}</Link>
          </Part>
        ))}
      </PartList>
    </>
  );
  const TocFragment = (
    <>
      <AsideItemHeader>
        <FontAwesomeIcon icon={faBookmark} />
        목차
      </AsideItemHeader>
      <Toc dangerouslySetInnerHTML={{ __html: post.tableOfContents }} />
    </>
  );
  const RelatedListFragment = (
    <>
      <AsideItemHeader>
        <FontAwesomeIcon icon={faLink} />
        관련 글
      </AsideItemHeader>
      <PostList>
        {relatedPosts.map(post => (
          <PostListItem key={post.fields.slug}>
            <Link to={`/${post.fields.slug}`}>
              {post.frontmatter.thumbnail && (
                <Img fixed={post.frontmatter.thumbnail.childImageSharp.fixed} />
              )}
              <h1 className="title">{post.frontmatter.title}</h1>
              <time className="description" dateTime={post.frontmatter.dateFormal}>
                {post.frontmatter.date}
              </time>
            </Link>
          </PostListItem>
        ))}
      </PostList>
    </>
  );
  const RecentListFragment = (
    <>
      <AsideItemLinkHeader to="/">
        <FontAwesomeIcon icon={faPlus} />
        최근 글
        <FontAwesomeIcon icon={faAngleRight} />
      </AsideItemLinkHeader>
      <PostList>
        {recentPosts.map(post => (
          <PostListItem
            key={post.fields.slug}
            className={post.fields.slug === slug ? "highlighted" : ""}
          >
            <Link to={`/${post.fields.slug}`}>
              {post.frontmatter.thumbnail && (
                <Img fixed={post.frontmatter.thumbnail.childImageSharp.fixed} />
              )}
              <h1 className="title">{post.frontmatter.title}</h1>
              <time className="description" dateTime={post.frontmatter.dateFormal}>
                {post.frontmatter.dateFromNow}
              </time>
            </Link>
          </PostListItem>
        ))}
      </PostList>
    </>
  );
  const CategoryListFragment = (
    <>
      <AsideItemLinkHeader
        to={
          currentCategoryTags.length > 1
            ? `/?tags=${categoryTagSlugs.join("+")}`
            : `/?tag=${currentCategoryTags[0]?.slug}`
        }
      >
        <FontAwesomeIcon icon={faTags} />
        {currentCategoryTags.map(tag => tag.name).join("&")} 카테고리 글
        <FontAwesomeIcon icon={faAngleRight} />
      </AsideItemLinkHeader>
      <CategoryList>
        {categoryPrevPost && (
          <CategoryListItem className="prev">
            <Link to={`/${categoryPrevPost.fields.slug}`}>
              <FontAwesomeIcon icon={faAngleUp} />
              <span className="text">이전</span>
              {categoryPrevPost.frontmatter.title}
            </Link>
          </CategoryListItem>
        )}
        {categoryNextPost && (
          <CategoryListItem className="next">
            <Link to={`/${categoryNextPost.fields.slug}`}>
              <FontAwesomeIcon icon={faAngleDown} />
              <span className="text">다음</span>
              {categoryNextPost.frontmatter.title}
            </Link>
          </CategoryListItem>
        )}
      </CategoryList>
    </>
  );

  useEffect(() => {
    const bodyHnElements = markdownRef.current.querySelectorAll("h2, h3");
    const tocLiElements = tocRef.current?.querySelectorAll("li") ?? [];
    const updateTocHighlighting = () => {
      const highlightingTocLiIndex =
        Array.prototype.filter.call(
          bodyHnElements,
          bodyHnElement => document.getElementById(bodyHnElement.id)?.offsetTop < window.pageYOffset
        ).length - 1;
      if (highlightingTocLiIndex < 0) {
        tocRef.current?.classList.add("nothing-highlighted");
      } else {
        tocRef.current?.classList.remove("nothing-highlighted");
      }
      tocLiElements.forEach((tocLiElement, tocLiIndex) => {
        if (tocLiIndex === highlightingTocLiIndex) {
          tocLiElement.classList.add("highlighted");
        } else {
          tocLiElement.classList.remove("highlighted");
        }
      });
    };
    updateTocHighlighting();
    const listener = throttle(updateTocHighlighting, 300);
    document.addEventListener("scroll", listener, false);
    return () => document.removeEventListener("scroll", listener);
  }, []);

  return (
    <Layout
      navigationProps={{ title: post.frontmatter.title }}
      asideChildren={
        <>
          {partPosts.length > 0 && <AsideItemInAside>{PartListFragment}</AsideItemInAside>}
          {post.tableOfContents && <AsideItemInAside ref={tocRef}>{TocFragment}</AsideItemInAside>}
          {relatedPosts.length > 0 && <AsideItemInAside>{RelatedListFragment}</AsideItemInAside>}
          {recentPosts.length > 0 && <AsideItemInAside>{RecentListFragment}</AsideItemInAside>}
        </>
      }
    >
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Title>{post.frontmatter.title}</Title>
      <Description>{post.frontmatter.description || post.excerpt}</Description>
      <TagListBox>
        <TagList tags={tags} type="anchor" anchorHrefBuilder={slug => `/?tag=${slug}`} />
      </TagListBox>
      <AdditionalBox>
        <Profile>
          <Link to="/about">
            <Img className="image" fluid={profileFile.childImageSharp.fluid} objectFit="cover" />
            <p className="name">{site.siteMetadata.author}</p>
          </Link>
        </Profile>
        <Date>
          <ul>
            <li>{post.frontmatter.dateFromNow}</li>
            <li>{post.frontmatter.date}</li>
          </ul>
        </Date>
        <Buttons>
          <RelativeBlock>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                copy(url);
                copyDropdownRef.current.classList.add("show");
                setTimeout(() => copyDropdownRef.current?.classList.remove("show"), 3000);
              }}
            >
              <FontAwesomeIcon icon={faShare} />
              <span>주소복사</span>
            </button>
            <DropdownOverlap ref={copyDropdownRef}>
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>복사됨</span>
            </DropdownOverlap>
          </RelativeBlock>
          <RelativeBlock>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => shareDropdownRef.current.classList.add("show")}
            >
              <FontAwesomeIcon icon={faShareAlt} />
              <span>공유</span>
            </button>
            <DropdownMenu ref={shareDropdownRef}>
              <FacebookShareLink url={url}>
                <FontAwesomeIcon icon={faFacebook} />
                <span>페이스북</span>
              </FacebookShareLink>
              <TwitterShareLink message={post.frontmatter.title} url={url}>
                <FontAwesomeIcon icon={faTwitter} />
                <span>트위터</span>
              </TwitterShareLink>
              <MailShareLink message={post.frontmatter.title} url={url}>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>이메일</span>
              </MailShareLink>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => shareDropdownRef.current.classList.remove("show")}
              >
                닫기
              </button>
            </DropdownMenu>
          </RelativeBlock>
        </Buttons>
      </AdditionalBox>
      {post.frontmatter.original && (
        <OriginalLink href={post.frontmatter.original}>
          <h2>원문</h2>
          <span>{post.frontmatter.original}</span>
        </OriginalLink>
      )}
      {partPosts.length > 0 && (
        <AsideItemInMain className="responsive">{PartListFragment}</AsideItemInMain>
      )}
      {post.tableOfContents && (
        <AsideItemInMain className="responsive nothing-highlighted">{TocFragment}</AsideItemInMain>
      )}
      <MarkdownSection ref={markdownRef} html={post.html} />
      {partPosts.length > 0 && <AsideItemInMain>{PartListFragment}</AsideItemInMain>}
      {relatedPosts.length > 0 && (
        <AsideItemInMain className="responsive">{RelatedListFragment}</AsideItemInMain>
      )}
      {recentPosts.length > 0 && (
        <AsideItemInMain className="responsive">{RecentListFragment}</AsideItemInMain>
      )}
      {(categoryPrevPost || categoryNextPost) && (
        <AsideItemInMain>{CategoryListFragment}</AsideItemInMain>
      )}
    </Layout>
  );
};
export default PostTemplate;

export const query = graphql`
  query postBySlug(
    $slug: String!
    $partSlugs: [String]
    $categorySlugs: [String]
    $relatedSlugs: [String]
  ) {
    site {
      siteMetadata {
        author
        siteUrl
      }
    }
    allTag {
      nodes {
        slug
        name
        group {
          color
        }
      }
    }
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt(truncate: true, pruneLength: 180)
      html
      tableOfContents(absolute: false)
      frontmatter {
        title
        description
        tags
        original
        ...DateFragment
      }
    }
    partPosts: allMarkdownRemark(
      filter: { fields: { slug: { in: $partSlugs } } }
      sort: { fields: fields___slug, order: ASC }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
    categoryPosts: allMarkdownRemark(
      filter: { fields: { slug: { in: $categorySlugs } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          ...DateFragment
        }
      }
    }
    recentPosts: allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }, limit: 5) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          ...DateFragment
          ...ThumbnailFragment
        }
      }
    }
    relatedPosts: allMarkdownRemark(
      filter: { fields: { slug: { in: $relatedSlugs } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          ...DateFragment
          ...ThumbnailFragment
        }
      }
    }
    profileFile: file(relativePath: { eq: "profile.jpg" }) {
      childImageSharp {
        fluid(fit: COVER, maxWidth: 40, maxHeight: 40, srcSetBreakpoints: [40, 60, 80, 120]) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
  fragment DateFragment on MarkdownRemarkFrontmatter {
    date(formatString: "YYYY년 M월 D일")
    dateFormal: date(formatString: "YYYY-MM-DD")
    dateFromNow: date(locale: "ko", fromNow: true)
  }
  fragment ThumbnailFragment on MarkdownRemarkFrontmatter {
    thumbnail {
      childImageSharp {
        fixed(fit: COVER, width: 39, height: 39, cropFocus: CENTER) {
          ...GatsbyImageSharpFixed_withWebp_noBase64
        }
      }
    }
  }
`;
