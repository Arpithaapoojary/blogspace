import { Link } from 'react-router-dom';
import { Clock, Calendar, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { formatDate, getReadingTime, truncate, getInitials } from '../utils/helpers';

export default function PostCard({ post }) {
  const {
    _id, title, content, coverImage, author,
    tags = [], createdAt, likes = [], commentsCount = 0,
  } = post;

  return (
    <article className="post-card card card-hover fade-in-up">
      {/* Cover image */}
      {coverImage && (
        <Link to={`/posts/${_id}`} className="post-card__img-wrap">
          <img src={coverImage} alt={title} className="post-card__img" loading="lazy" />
        </Link>
      )}

      <div className="post-card__body">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="post-card__tags">
            {tags.slice(0, 2).map(tag => (
              <Link key={tag} to={`/tag/${tag}`} className="tag-badge">#{tag}</Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={`/posts/${_id}`} className="post-card__title-link">
          <h2 className="post-card__title">{title}</h2>
        </Link>

        {/* Excerpt */}
        <p className="post-card__excerpt">{truncate(content, 130)}</p>

        {/* Footer */}
        <div className="post-card__footer">
          {/* Author */}
          <Link to={`/profile/${author?._id}`} className="post-card__author">
            <span className="avatar avatar-sm">
              {author?.avatar
                ? <img src={author.avatar} alt={author.name} />
                : getInitials(author?.name || '?')}
            </span>
            <span className="post-card__author-name">{author?.name}</span>
          </Link>

          {/* Meta */}
          <div className="post-card__meta">
            <span className="post-card__meta-item">
              <Calendar size={12} />
              {formatDate(createdAt)}
            </span>
            <span className="post-card__meta-item">
              <Clock size={12} />
              {getReadingTime(content)}
            </span>
            <span className="post-card__meta-item">
              <Heart size={12} />
              {likes.length}
            </span>
            <span className="post-card__meta-item">
              <MessageCircle size={12} />
              {commentsCount}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .post-card { display: flex; flex-direction: column; }
        .post-card__img-wrap { display: block; overflow: hidden; aspect-ratio: 16/9; }
        .post-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .post-card:hover .post-card__img { transform: scale(1.03); }
        .post-card__body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.625rem; flex: 1; }
        .post-card__tags { display: flex; gap: 0.375rem; flex-wrap: wrap; }
        .post-card__title-link { text-decoration: none; }
        .post-card__title {
          font-size: 1.0625rem;
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -0.01em;
          color: var(--fg-base);
          transition: color 0.15s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-card__title-link:hover .post-card__title { color: var(--accent); }
        .post-card__excerpt {
          font-size: 0.875rem;
          color: var(--fg-muted);
          line-height: 1.6;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border); }
        .post-card__author { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; min-width: 0; }
        .post-card__author-name { font-size: 0.8125rem; font-weight: 500; color: var(--fg-base); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color 0.15s; }
        .post-card__author:hover .post-card__author-name { color: var(--accent); }
        .post-card__meta { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
        .post-card__meta-item { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--fg-subtle); white-space: nowrap; }
      `}</style>
    </article>
  );
}
