import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App.jsx';

describe('App', () => {
  it('renders the nav with a link back to home', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Harsh Patel' })).toHaveAttribute('href', '/');
  });

  it('renders the Ventures page heading on /ventures', () => {
    render(
      <MemoryRouter initialEntries={['/ventures']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/portfolio of companies/i);
  });

  it('renders the Philanthropy page heading on /philanthropy', () => {
    render(
      <MemoryRouter initialEntries={['/philanthropy']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/giving back/i);
  });
});

describe('Mobile nav toggle', () => {
  it('opens the nav-links panel when the toggle button is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const toggle = screen.getByRole('button', { name: /open menu/i });
    const panel = document.querySelector('.nav-links');
    expect(panel).not.toHaveClass('is-open');

    await userEvent.click(toggle);
    expect(panel).toHaveClass('is-open');
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
  });
});
