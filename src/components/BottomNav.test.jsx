import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import BottomNav from './BottomNav';
import React from 'react';

describe('BottomNav', () => {
  it('highlights the active link based on the current route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <BottomNav />
      </MemoryRouter>
    );

    // Dashboard link should be active
    // The active state in BottomNav applies 'font-semibold' and 'text-primary' to the text span
    const dashboardText = screen.getByText('Dashboard');
    expect(dashboardText).toHaveClass('font-semibold');
    expect(dashboardText).toHaveClass('text-primary');

    // Anggota link should NOT be active
    const membersText = screen.getByText('Anggota');
    expect(membersText).not.toHaveClass('font-semibold');
    // Note: checking for text-slate-400 might be flaky if class order matters or if tailwind merging does something,
    // but looking at the component code it conditionally applies the class string.
    expect(membersText).toHaveClass('text-slate-400');
  });

  it('changes active link when route is different', () => {
    render(
        <MemoryRouter initialEntries={['/finance']}>
          <BottomNav />
        </MemoryRouter>
      );

      // Finance link should be active
      const financeText = screen.getByText('Keuangan');
      expect(financeText).toHaveClass('font-semibold');
      expect(financeText).toHaveClass('text-primary');

      // Dashboard link should NOT be active
      const dashboardText = screen.getByText('Dashboard');
      expect(dashboardText).not.toHaveClass('font-semibold');
  });
});
