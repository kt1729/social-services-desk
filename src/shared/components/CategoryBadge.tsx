import { getCategoryLabel, getCategoryIcon } from '../lib/categories';
import type { CategoryKey, LanguageCode } from '../types';

interface CategoryBadgeProps {
  category: CategoryKey;
  lang?: LanguageCode;
}

export default function CategoryBadge({ category, lang = 'en' }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
      {getCategoryIcon(category)} {getCategoryLabel(category, lang)}
    </span>
  );
}
