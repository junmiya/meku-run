import { WordCard } from '../types/WordCard';

export class PaginationManager {
  static getPageItems<T>(items: T[], page: number, perPage: number): T[] {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }

  static getTotalPages(totalItems: number, perPage: number): number {
    return Math.ceil(totalItems / perPage);
  }
}

export class FilterManager {
  static filterCards(
    cards: WordCard[],
    searchQuery: string,
    selectedTag: string,
    showStarredOnly: boolean
  ): WordCard[] {
    return cards.filter(card => {
      // 検索クエリでフィルタ
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesWord = card.word.toLowerCase().includes(query);
        const matchesMeaning = card.meaning.toLowerCase().includes(query);
        if (!matchesWord && !matchesMeaning) return false;
      }

      // タグでフィルタ
      if (selectedTag) {
        if (!card.tags || !card.tags.includes(selectedTag)) return false;
      }

      // お気に入りでフィルタ
      if (showStarredOnly) {
        if (!card.isStarred) return false;
      }

      return true;
    });
  }

  static sortCards(
    cards: WordCard[],
    sortBy: 'createdAt' | 'updatedAt' | 'alphabetical',
    sortOrder: 'asc' | 'desc'
  ): WordCard[] {
    const sortedCards = [...cards];

    sortedCards.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updatedAt':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'alphabetical':
          comparison = a.word.toLowerCase().localeCompare(b.word.toLowerCase());
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sortedCards;
  }

  static getAllTags(cards: WordCard[]): string[] {
    const tagSet = new Set<string>();
    cards.forEach(card => {
      if (card.tags) {
        card.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }
}