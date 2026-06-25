/**
 * Estimate reading time for markdown content
 * @param {string} content
 * @returns {string}
 */
export const getReadingTime = (content) => {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

/**
 * Format a date to a human-readable relative or absolute string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d; // ms

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (days >= 1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  if (minutes >= 1) return `${minutes}m ago`;
  return 'just now';
};

/**
 * Get initials from a name for avatar fallback
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

/**
 * Truncate text to a max length
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export const truncate = (text, maxLen = 160) => {
  if (!text) return '';
  // Strip markdown symbols for preview
  const plain = text.replace(/[#*`_~\[\]]/g, '').replace(/\n+/g, ' ');
  return plain.length > maxLen ? plain.slice(0, maxLen).trim() + '…' : plain;
};

/**
 * Tag color palette — deterministic by tag string
 */
const TAG_COLORS = [
  { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
  { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
  { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  { bg: 'rgba(244,63,94,0.12)', color: '#fb7185', border: 'rgba(244,63,94,0.25)' },
  { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  { bg: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: 'rgba(6,182,212,0.25)' },
  { bg: 'rgba(251,146,60,0.12)', color: '#fb923c', border: 'rgba(251,146,60,0.25)' },
];

export const getTagColor = (tag) => {
  if (!tag) return TAG_COLORS[0];
  const sum = tag.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return TAG_COLORS[sum % TAG_COLORS.length];
};
