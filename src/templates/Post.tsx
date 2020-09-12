import React, { useRef, useEffect } from "react";
import { Link, PageProps, graphql } from "gatsby";
import Img from "gatsby-image/withIEPolyfill";
import oc from "open-color";
import copy from "copy-to-clipboard";
import styled, { ApplyBreaks, css, breaks } from "../utils/styled-components";
import { throttle } from "lodash";
import {
  SiteSiteMetadata,
  MarkdownRemarkFrontmatter,
  Tag,
  SitePageContext,
  File,
} from "../generated/graphql-types";
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
} from "@fortawesome/free-solid-svg-icons";

const Title = styled.h1`
  margin: 32px 8px 0;
  font-size: 0.35rem;
  font-weight: 500;
  ${ApplyBreaks(
    px => css`
      margin-top: 48px;
      text-align: center;
      font-size: 0.44rem;
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
  margin: 16px 11px;
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
  margin: 32px 5px 40px;
  padding: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${oc.gray[4]};
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  ${ApplyBreaks(
    px => css`
      align-items: center;
    `,
    ["sm"]
  )};
`;

const NameAndDate = styled.div`
  display: flex;
  flex-direction: column-reverse;
  ${ApplyBreaks(
    px => css`
      flex-direction: row;
      align-items: center;
    `,
    ["sm"]
  )};
  address,
  time {
    display: block;
    margin: 0;
    padding: 0;
    font-style: inherit;
  }
  address {
    a {
      width: fit-content;
      border-radius: 24px;
      padding: 4px;
      display: flex;
      align-items: center;
      text-decoration: none;
      font-weight: 300;
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
  }
  time {
    margin: 0;
    margin-left: 8px;
    color: ${oc.gray[6]};
    ul {
      display: flex;
      margin: 0;
      padding: 0;
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
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  /* margin-top: 8px; */
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
    padding: 8px 2px;
    appearance: none;
    background: none;
    cursor: pointer;
    font-weight: 300;
    display: flex;
    align-items: center;
    font-size: 0.14rem;
    color: ${oc.gray[7]};
    margin-right: 6px;
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
        color: ${oc.gray[9]};
      }
    }
    &:last-child {
      margin-right: 0;
    }
    svg {
      margin-right: 5px;
    }
  }
`;

const AsideItemInMain = styled.section`
  margin: 32px -8px;
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
  > p {
    justify-content: center;
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
    transition: 100ms ease-in-out;
    transition-property: background-color, color;
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
  svg {
    margin-right: 0.06rem;
  }
`;

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
    transition: 100ms ease-in-out;
    transition-property: background-color, color;
    &::before {
      content: counter(part-list);
      width: 19px;
      margin-left: -3px;
      margin-right: 1px;
      text-align: center;
      font-weight: 700;
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
  a {
    display: block;
    width: fit-content;
    height: calc(0.36rem + 6px);
    max-width: 360px;
    border-radius: 8px;
    padding: 3px 8px;
    text-decoration: none;
    align-items: center;
    color: inherit;
    transition: 100ms ease-in-out;
    transition-property: background-color, color;
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
      width: 0.36rem;
      height: 0.36rem;
      border-radius: 6px;
      background-color: ${oc.gray[2]};
      margin-left: -5px;
      margin-right: 5px;
    }
    .title {
      display: block;
      margin: 0;
      font-size: 0.14rem;
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
    transition: 100ms ease-in-out;
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
    transition: 100ms ease-in-out;
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

  const currentIndexOfCategoryPosts = categoryPosts.findIndex(post => post.fields.slug === slug);
  const categoryPrevPost = categoryPosts[currentIndexOfCategoryPosts + 1];
  const categoryNextPost = categoryPosts[currentIndexOfCategoryPosts - 1];
  const currentCategoryTags = tags.filter(tag => categoryTagSlugs.includes(tag.slug));
  console.log(currentCategoryTags);

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
                <Img fluid={post.frontmatter.thumbnail.childImageSharp.fluid} />
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
      <AsideItemHeader>
        <Link to="/">
          <FontAwesomeIcon icon={faPlus} />
          최근 글
        </Link>
      </AsideItemHeader>
      <PostList>
        {recentPosts.map(post => (
          <PostListItem
            key={post.fields.slug}
            className={post.fields.slug === slug ? "highlighted" : ""}
          >
            <Link to={`/${post.fields.slug}`}>
              {post.frontmatter.thumbnail && (
                <Img fluid={post.frontmatter.thumbnail.childImageSharp.fluid} />
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
      <AsideItemHeader>
        <Link to={`/?tag=${currentCategoryTags[0]?.slug}`}>
          <FontAwesomeIcon icon={faTags} />
          {currentCategoryTags.map(tag => tag.name).join("&")} 카테고리 글
        </Link>
      </AsideItemHeader>
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
        <TagList tags={tags} />
      </TagListBox>
      <AdditionalBox>
        <NameAndDate>
          <address>
            <Link to="/">
              <Img className="image" fluid={profileFile.childImageSharp.fluid} objectFit="cover" />
              <p className="name">{site.siteMetadata.author}</p>
            </Link>
          </address>
          <time dateTime={post.frontmatter.dateFormal}>
            <ul>
              <li>{post.frontmatter.dateFromNow}</li>
              <li>{post.frontmatter.date}</li>
            </ul>
          </time>
        </NameAndDate>
        <Buttons>
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => copy(site.siteMetadata.siteUrl + slug)}
          >
            <FontAwesomeIcon icon={faShare} />
            <span>URL 복사</span>
          </button>
        </Buttons>
      </AdditionalBox>
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
      tableOfContents
      frontmatter {
        title
        description
        tags
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
        fluid(fit: OUTSIDE, maxWidth: 40, srcSetBreakpoints: [40, 60, 80, 120]) {
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
        fluid(fit: OUTSIDE, maxWidth: 36, srcSetBreakpoints: [36, 54, 72, 108]) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;
