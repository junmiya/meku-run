import { render, screen } from '@testing-library/react';
import React from 'react';

import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText('単語カードアプリ');
  expect(headerElement).toBeInTheDocument();
});

test('renders create button', () => {
  render(<App />);
  const createButton = screen.getByText('新しいカードを作成');
  expect(createButton).toBeInTheDocument();
});

test('renders sample data button', () => {
  render(<App />);
  const sampleButton = screen.getByText('TOEIC700点サンプル');
  expect(sampleButton).toBeInTheDocument();
});
