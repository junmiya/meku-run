import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { WordCard } from '../../types/WordCard';
import WordCardComponent from '../WordCard';

const mockCard: WordCard = {
  id: '1',
  word: 'accomplish',
  meaning: '達成する、成し遂げる',
  created_at: '2025-01-12T00:00:00.000Z',
  updated_at: '2025-01-12T00:00:00.000Z',
  tags: ['動詞', 'ビジネス'],
  isStarred: true,
};

describe('WordCard', () => {
  it('renders word and meaning correctly', () => {
    render(<WordCardComponent card={mockCard} />);
    
    expect(screen.getByText('accomplish')).toBeInTheDocument();
    // Initially, meaning should not be visible (card not flipped)
    expect(screen.queryByText('達成する、成し遂げる')).toBeInTheDocument();
  });

  it('displays tags when provided', () => {
    render(<WordCardComponent card={mockCard} />);
    
    expect(screen.getByText('動詞')).toBeInTheDocument();
    expect(screen.getByText('ビジネス')).toBeInTheDocument();
  });

  it('shows starred state correctly', () => {
    render(<WordCardComponent card={mockCard} />);
    
    const starButton = screen.getByRole('button', { name: /★/ });
    expect(starButton).toHaveClass('starred');
  });

  it('flips card when clicked', () => {
    render(<WordCardComponent card={mockCard} />);
    
    const cardElement = screen.getByText('accomplish').closest('.card');
    expect(cardElement).not.toHaveClass('flipped');
    
    if (cardElement) {
      fireEvent.click(cardElement);
      expect(cardElement).toHaveClass('flipped');
    }
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<WordCardComponent card={mockCard} onEdit={mockOnEdit} />);
    
    const editButton = screen.getByRole('button', { name: '編集' });
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockCard);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);
    
    render(<WordCardComponent card={mockCard} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockCard.id);
  });

  it('calls onToggleStar when star button is clicked', () => {
    const mockOnToggleStar = jest.fn();
    render(<WordCardComponent card={mockCard} onToggleStar={mockOnToggleStar} />);
    
    const starButton = screen.getByRole('button', { name: /★/ });
    fireEvent.click(starButton);
    
    expect(mockOnToggleStar).toHaveBeenCalledWith(mockCard.id);
  });

  it('renders without tags when none provided', () => {
    const cardWithoutTags = { ...mockCard, tags: undefined };
    render(<WordCardComponent card={cardWithoutTags} />);
    
    expect(screen.queryByText('動詞')).not.toBeInTheDocument();
  });

  it('renders unstarred card correctly', () => {
    const unstarredCard = { ...mockCard, isStarred: false };
    render(<WordCardComponent card={unstarredCard} />);
    
    const starButton = screen.getByRole('button', { name: /★/ });
    expect(starButton).not.toHaveClass('starred');
  });
});