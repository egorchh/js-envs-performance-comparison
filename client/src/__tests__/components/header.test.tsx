import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../../components/header';

describe('Header Component', () => {
    test('renders title correctly', () => {
        render(<Header />);
        expect(screen.getByText(/Runtimer/i)).toBeInTheDocument();
    });
}); 