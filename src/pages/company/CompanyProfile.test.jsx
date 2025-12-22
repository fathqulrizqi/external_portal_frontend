import { render, screen } from '@testing-library/react';
import CompanyProfile from './CompanyProfile';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom'; // Add this import for custom matchers

// Mock props if needed
describe('CompanyProfile page', () => {
  it('renders the company profile page', () => {
    render(<CompanyProfile companyId={1} />);
    // Check for loading state or main heading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
