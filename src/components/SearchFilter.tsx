import React from 'react';
import './SearchFilter.css';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'createdAt' | 'updatedAt' | 'alphabetical';
  onSortByChange: (sortBy: 'createdAt' | 'updatedAt' | 'alphabetical') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  showStarredOnly: boolean;
  onShowStarredOnlyChange: (show: boolean) => void;
  selectedTag: string;
  onSelectedTagChange: (tag: string) => void;
  availableTags: string[];
  totalCards: number;
  filteredCards: number;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  showStarredOnly,
  onShowStarredOnlyChange,
  selectedTag,
  onSelectedTagChange,
  availableTags,
  totalCards,
  filteredCards
}) => {
  return (
    <div className="search-filter">
      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="単語や意味で検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => onSearchChange('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>並び順:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'createdAt' | 'updatedAt' | 'alphabetical')}
            className="filter-select"
          >
            <option value="createdAt">作成日</option>
            <option value="updatedAt">更新日</option>
            <option value="alphabetical">アルファベット順</option>
          </select>
          <button
            className={`sort-order-btn ${sortOrder === 'desc' ? 'desc' : 'asc'}`}
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? '昇順' : '降順'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="filter-group">
          <label>タグ:</label>
          <select
            value={selectedTag}
            onChange={(e) => onSelectedTagChange(e.target.value)}
            className="filter-select"
          >
            <option value="">すべて</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showStarredOnly}
              onChange={(e) => onShowStarredOnlyChange(e.target.checked)}
            />
            お気に入りのみ
          </label>
        </div>
      </div>

      <div className="filter-summary">
        {filteredCards !== totalCards && (
          <span className="filter-result">
            {totalCards}件中{filteredCards}件を表示
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;