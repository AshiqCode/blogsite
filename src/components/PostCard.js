import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <Link to={`/post/${post.slug}`} className="card-link-wrapper">
      <article className="card clickable">
        {post.coverImage ? (
          <div className="card-image">
            <img src={post.coverImage} alt={post.title} />
          </div>
        ) : null}

        <div className="card-body">
          <h2 className="card-title">{post.title}</h2>

          <p className="card-excerpt">{post.excerpt}</p>

          <div className="card-footer">
            <span className="link">Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
