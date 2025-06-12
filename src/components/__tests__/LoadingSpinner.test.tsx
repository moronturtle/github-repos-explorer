import { render } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';
import { describe, expect, it } from 'vitest';

describe('LoadingSpinner', () => {
  it('renders a loading spinner with correct classes Daisy UI', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
  });
});
