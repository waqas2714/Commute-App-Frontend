import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DriverProfile from '../pages/DriverProfile';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Mock necessary dependencies
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
  toastOptions: {},
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

// Test: Render the DriverProfile component
describe('DriverProfile Component', () => {
  const driverId = '123';
  const userId = '456';

  beforeEach(() => {
    // Mock useParams to return the driverId
    useParams.mockReturnValue({ driverId });

    // Mock the localStorage to return the userId
    localStorage.setItem('user', JSON.stringify({ _id: userId }));
    
    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders the driver profile page', async () => {
    const mockDriver = {
      _id: '123',
      image: 'driver-image.jpg',
      username: 'John Doe',
      school: 'ABC University',
      carDetails: {
        name: 'Toyota Corolla',
        model: '2021',
        number: 'ABC123',
        color: 'Blue',
      },
    };
    const mockReviews = [
      { from: { username: 'Passenger1', school: 'XYZ School' }, comment: 'Great ride!' },
      { from: { username: 'Passenger2', school: 'ABC School' }, comment: 'Very safe driver!' },
    ];

    // Mock the API responses
    axios.get.mockResolvedValueOnce({
      data: { success: true, driver: mockDriver, isPassenger: false },
    });
    axios.get.mockResolvedValueOnce({
      data: { success: true, reviews: mockReviews },
    });

    render(<DriverProfile />);

    // Check if the driver information is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('ABC University')).toBeInTheDocument();
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('2021')).toBeInTheDocument();

    // Check if the reviews are displayed
    expect(screen.getByText('Passenger1')).toBeInTheDocument();
    expect(screen.getByText('Passenger2')).toBeInTheDocument();
  });

  test('displays "Driver Not Found" if driver data is not found', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: false } });

    render(<DriverProfile />);

    await waitFor(() => {
      expect(screen.getByText('Driver Not Found.')).toBeInTheDocument();
    });
  });

  test('displays error message when there is an issue fetching driver info', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch driver info'));

    render(<DriverProfile />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('There was a problem getting driver info.', expect.any(Object));
    });
  });

  test('displays error message when there is an issue fetching reviews', async () => {
    axios.get.mockResolvedValueOnce({
      data: { success: true, driver: { username: 'John Doe' } },
    });
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch reviews'));

    render(<DriverProfile />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('There was a problem getting reviews.', expect.any(Object));
    });
  });

  test('shows "No Reviews Were Given" when no reviews are available', async () => {
    axios.get.mockResolvedValueOnce({
      data: { success: true, driver: { username: 'John Doe' } },
    });
    axios.get.mockResolvedValueOnce({
      data: { success: true, reviews: [] },
    });

    render(<DriverProfile />);

    await waitFor(() => {
      expect(screen.getByText('No Reviews Were Given.')).toBeInTheDocument();
    });
  });

  test('redirects to login if token is invalid', async () => {
    localStorage.setItem('token', 'invalid-token');
    axios.get.mockResolvedValueOnce({ data: null });

    render(<DriverProfile />);

    await waitFor(() => {
      expect(useNavigate).toHaveBeenCalledWith('/');
      expect(toast.error).toHaveBeenCalledWith(
        'Session Expired. Please Log In Again.',
        expect.any(Object)
      );
    });
  });

  test('handles offline scenario and redirects accordingly', () => {
    // Mocking navigator.onLine to simulate offline mode
    Object.defineProperty(window, 'navigator', {
      value: { onLine: false },
      writable: true,
    });

    render(<DriverProfile />);

    expect(toast.error).toHaveBeenCalledWith(
      'You do not have an internet connection.',
      expect.any(Object)
    );
  });
});
