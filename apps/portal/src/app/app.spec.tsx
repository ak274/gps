import { render, screen } from '@testing-library/react';

import App from './app';

describe('<App />', () => {
  it('renders', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: /portal/i })).toBeTruthy();
  });
});
