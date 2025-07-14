import { useState } from 'react';

import { WordCard } from '../types/WordCard';

interface UseCardFormOptions {
  onSave: (cardData: Omit<WordCard, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  onCancel: () => void;
}

export const useCardForm = ({ onSave, onCancel }: UseCardFormOptions) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<WordCard | undefined>();

  const openCreateForm = () => {
    setEditingCard(undefined);
    setShowForm(true);
  };

  const openEditForm = (card: WordCard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleFormSave = (
    cardData: Omit<WordCard, 'id' | 'created_at' | 'updated_at' | 'user_id'>
  ) => {
    onSave(cardData);
    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCard(undefined);
    onCancel();
  };

  return {
    showForm,
    editingCard,
    openCreateForm,
    openEditForm,
    handleFormSave,
    closeForm,
  };
};
