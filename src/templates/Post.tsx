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
import { faLink, faList } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Title = styled.h1`
  margin: 2rem 0.5rem 0;
  font-size: 2.2rem;
  font-weight: 500;
  ${ApplyBreaks(
    px => css`
      margin-top: 3rem;
      text-align: center;
      font-size: 2.75rem;
    `,
    ["sm"]
  )};
`;

const Description = styled.p`
  margin: 1rem 0.7rem 0;
  color: ${oc.gray[7]};
  font-size: 0.9rem;
  font-weight: 300;
  ${ApplyBreaks(
    px => css`
      margin: 1.5rem 10% 0;
      text-align: center;
      font-size: 1rem;
    `,
    ["sm"]
  )};
`;

const TagListBox = styled.div`
  margin: 1rem 0.7rem 1rem;
  display: flex;
  ${ApplyBreaks(
    px => css`
      margin-top: 1.3rem;
      justify-content: center;
    `,
    ["sm"]
  )};
`;

const AdditionalBox = styled.div`
  margin: 2rem 0.3rem 2.5rem;
  padding: 0;
  padding-bottom: 0.5rem;
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
  > * {
  }
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
      border-radius: 1.5rem;
      padding: 0.25rem;
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
        width: 2.5rem;
        height: 2.5rem;
        margin: 0;
        padding: 0;
        /* object-fit: cover; */
        border-radius: 50%;
        border: 0.125rem solid white;
        background-color: ${oc.gray[1]};
      }
      .name {
        margin: 0;
        margin-left: 0.333rem;
        margin-right: 0.667rem;
      }
    }
  }
  time {
    margin: 0;
    margin-left: 0.5rem;
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
        margin: 0 0.15rem;
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
  /* margin-top: 0.5rem; */
  margin-bottom: 0.5rem;
  ${ApplyBreaks(
    px => css`
      margin-bottom: 0;
    `,
    ["sm"]
  )};
  button {
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    appearance: none;
    background: none;
    cursor: pointer;
    font-weight: 300;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: ${oc.gray[7]};
    margin-right: 0.4rem;
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
      margin-right: 0.3rem;
    }
  }
`;

const AsideBoxItemInMain = styled.section`
  margin: 2rem 0.5rem 1rem;
  ${ApplyBreaks(
    px => css`
      display: none;
    `,
    [ASIDE_BREAK]
  )};
`;
const AsideBoxItemInAside = styled.section`
  margin: 2rem 0.5rem 1rem;
  > p {
    justify-content: center;
    text-align: end;
  }
`;
const AsideBoxItemHeader = styled.p`
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  > span {
    margin: 0 0.3rem;
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
  margin: 0.2rem 0;
  padding: 0;
  counter-increment: part-list;
  color: ${oc.gray[6]};
  &.highlighted {
    color: ${oc.gray[9]};
    font-weight: 500;
    a::before {
      content: "\\2022";
    }
  }
  a {
    display: inline-flex;
    border-radius: 0.5rem;
    padding: 0.2rem 0.5rem;
    text-decoration: none;
    align-items: center;
    font-size: 0.9rem;
    color: inherit;
    transition: 100ms ease-in-out;
    transition-property: background-color, color;
    &::before {
      content: counter(part-list);
      width: 1.2rem;
      margin-left: -0.2rem;
      margin-right: 0.1rem;
      text-align: center;
      font-weight: 700;
      font-size: 0.8rem;
    }
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
  p {
    margin: 0;
    padding: 0;
  }
  a {
    display: inline-flex;
    border-radius: 0.5rem;
    padding: 0.2rem 0.5rem;
    text-decoration: none;
    align-items: center;
    font-size: 0.9rem;
    color: inherit;
    transition: 100ms ease-in-out;
    transition-property: background-color, color;
    &::before {
      width: 1.2rem;
      margin-left: -0.2rem;
      margin-right: 0.1rem;
      text-align: center;
      font-weight: 700;
      font-size: 0.8rem;
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
        margin-left: 1rem;
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
  } = data;
  const { slug } = pageContext as SitePageContext;
  const tags = allTag.nodes.filter(tag => post.frontmatter.tags?.includes(tag.slug));
  const tocRef = useRef<HTMLDivElement>();
  const markdownRef = useRef<HTMLElement>();

  const PartListFragment = (
    <>
      <AsideBoxItemHeader>
        <FontAwesomeIcon icon={faCopy} />
        <span>이어지는 글</span>
      </AsideBoxItemHeader>
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
      <AsideBoxItemHeader>
        <FontAwesomeIcon icon={faList} />
        <span>목차</span>
      </AsideBoxItemHeader>
      <Toc dangerouslySetInnerHTML={{ __html: post.tableOfContents }} />
    </>
  );

  useEffect(() => {
    console.log(
      "CATEGORY",
      categoryPosts.map(p => p.frontmatter.title)
    );
    console.log(
      "RECENT",
      recentPosts.map(p => p.frontmatter.title)
    );
    const bodyHnElements = markdownRef.current.querySelectorAll("h2, h3");
    const tocLiElements = tocRef.current?.querySelectorAll("li") ?? [];
    const updateTocHighlighting = () => {
      const highlightingTocLiIndex =
        Array.prototype.filter.call(
          bodyHnElements,
          bodyHnElement => document.getElementById(bodyHnElement.id).offsetTop < window.pageYOffset
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
          {partPosts?.length > 0 && <AsideBoxItemInAside>{PartListFragment}</AsideBoxItemInAside>}
          {post.tableOfContents && (
            <AsideBoxItemInAside ref={tocRef}>{TocFragment}</AsideBoxItemInAside>
          )}
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
            <FontAwesomeIcon icon={faLink} />
            <span>URL 복사</span>
          </button>
        </Buttons>
      </AdditionalBox>
      {partPosts?.length > 0 && <AsideBoxItemInMain>{PartListFragment}</AsideBoxItemInMain>}
      {post.tableOfContents && (
        <AsideBoxItemInMain className="nothing-highlighted">{TocFragment}</AsideBoxItemInMain>
      )}
      <MarkdownSection ref={markdownRef} html={post.html} />
    </Layout>
  );
};
export default PostTemplate;

export const query = graphql`
  query postBySlug($slug: String!, $partSlugs: [String], $categorySlugs: [String]) {
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
      excerpt(pruneLength: 180)
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
        }
      }
    }
    profileFile: file(relativePath: { eq: "profile.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 40, srcSetBreakpoints: [40, 60, 80, 120]) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
  }
  fragment DateFragment on MarkdownRemarkFrontmatter {
    date(formatString: "YYYY년 M월 D일")
    dateFormal: date(formatString: "YYYY-MM-DD")
    dateFromNow: date(locale: "ko", fromNow: true)
  }
`;
