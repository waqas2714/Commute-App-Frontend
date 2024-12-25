import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CurrentRides from '../pages/CurrentRides';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock the necessary dependencies
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
  toastOptions: {},
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

// Test: Render the CurrentRides component
describe('CurrentRides Component', () => {
  beforeEach(() => {
    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders the current rides page', () => {
    render(<CurrentRides />);
    
    // Check if "Ride Requests" and "My Ride Listings" headers are displayed
    expect(screen.getByText(/Ride Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/My Ride Listings/i)).toBeInTheDocument();
  });

  test('displays loading spinner when fetching data', () => {
    render(<CurrentRides />);
    
    // Initially loading spinner should be shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('fetches and displays ride requests', async () => {
    const mockRideRequests = [
      { _id: '1', username: 'John', school: 'XYZ School', departure: 'A', destination: 'B', date: '2024-12-25', time: '10:00 AM', image: 'img.jpg' },
      { _id: '2', username: 'Jane', school: 'ABC School', departure: 'C', destination: 'D', date: '2024-12-26', time: '11:00 AM', image: 'img2.jpg' },
    ];

    axios.get.mockResolvedValueOnce({ data: { success: true, rideRequests: mockRideRequests } });

    render(<CurrentRides />);

    await waitFor(() => {
      // Check if the ride requests are displayed
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });

  test('displays error message when ride requests fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch ride requests'));

    render(<CurrentRides />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch ride requests",
        expect.any(Object)
      );
    });
  });

  test('fetches and displays ride listings', async () => {
    const mockRideListings = [
      { _id: '1', departure: 'A', destination: 'B', date: '2024-12-25', time: '10:00 AM' },
      { _id: '2', departure: 'C', destination: 'D', date: '2024-12-26', time: '11:00 AM' },
    ];

    axios.get.mockResolvedValueOnce({ data: { success: true, listings: mockRideListings } });

    render(<CurrentRides />);

    await waitFor(() => {
      // Check if the ride listings are displayed
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });
  });

  test('displays error message when ride listings fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch ride listings'));

    render(<CurrentRides />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch ride listings",
        expect.any(Object)
      );
    });
  });

  test('displays error message when offline and no saved data', () => {
    // Mock navigator.onLine to simulate being offline
    Object.defineProperty(window, 'navigator', {
      value: { onLine: false },
      writable: true,
    });

    localStorage.removeItem('rideRequests');
    localStorage.removeItem('rideListings');

    render(<CurrentRides />);

    expect(toast.error).toHaveBeenCalledWith(
      "You are offline and there is no saved data.",
      expect.any(Object)
    );
  });

  test('redirects to login if token is invalid', async () => {
    localStorage.setItem('token', 'invalid-token');
    axios.get.mockResolvedValueOnce({ data: null });

    render(<CurrentRides />);

    await waitFor(() => {
      expect(useNavigate).toHaveBeenCalledWith('/');
      expect(toast.error).toHaveBeenCalledWith(
        "Session Expired. Please Log In Again.",
        expect.any(Object)
      );
    });
  });
});
