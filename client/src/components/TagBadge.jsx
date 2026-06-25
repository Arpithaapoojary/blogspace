import { Link } from 'react-router-dom';
import { getTagColor } from '../utils/helpers';

export default function TagBadge({ tag }) {
  const colors = getTagColor(tag);
  return (
    <Link
      to={`/tag/${tag}`}
      className="tag-badge"
      style={{
        background: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
      }}
    >
      #{tag}
    </Link>
  );
}
