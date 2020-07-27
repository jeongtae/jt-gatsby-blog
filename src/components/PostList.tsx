import React from "react";
import { Link } from "gatsby";
import { MarkdownRemark } from "../generated/graphql-types";

const PostList: React.FC<{ posts: MarkdownRemark[] }> = ({ posts }) => {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <article>
            <Link to={post.fields.slug}>
              <h1>{post.frontmatter.title}</h1>
              <p>{post.excerpt}</p>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
};
export default PostList;
