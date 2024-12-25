// GetRide.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GetRide from '../pages/GetRide';

describe('GetRide Component', () => {
  test('renders the component without errors', () => {
    render(<GetRide />);
    expect(screen.getByText(/Set Departure/i)).toBeInTheDocument();
    expect(screen.getByText(/Set Destination/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Find Your Location/i)).toBeInTheDocument();
  });

  test('should open and close ride offers', () => {
    render(<GetRide />);
    const findRidesButton = screen.getByText(/Find Rides/i);
    fireEvent.click(findRidesButton);
    expect(screen.getByText(/RIDES/i)).toBeInTheDocument();

    const arrowDown = screen.getByTestId('arrow-down');
    fireEvent.click(arrowDown);
    expect(screen.queryByText(/RIDES/i)).not.toBeInTheDocument();

    fireEvent.click(findRidesButton);
    fireEvent.click(arrowDown);
    expect(screen.getByText(/RIDES/i)).toBeInTheDocument();
  });

  
});
