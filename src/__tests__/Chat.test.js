import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from '../pages/Chat';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

jest.mock('socket.io-client', () => jest.fn().mockReturnValue({
  on: jest.fn(),
  emit: jest.fn(),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Test: Render the Chat component
describe('Chat Component', () => {
  beforeEach(() => {
    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders the chat page', () => {
    render(<Chat />);
    
    // Check for the title
    expect(screen.getByText(/chat/i)).toBeInTheDocument();
    
    // Ensure loading message is displayed while chat tags are loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows error message if no token is found', async () => {
    localStorage.setItem('token', '');

    render(<Chat />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please Log In.",
        expect.any(Object)
      );
    });
  });

  test('loads and displays chat tags', async () => {
    const mockChats = [
      { departure: 'A', destination: 'B', date: '2024-12-25', time: '10:00 AM', listingId: '1', isDriver: true },
      { departure: 'C', destination: 'D', date: '2024-12-26', time: '11:00 AM', listingId: '2', isDriver: false },
    ];
    require('axios').get.mockResolvedValueOnce({ data: { success: true, chats: mockChats } });

    render(<Chat />);

    // Check if the chat tags are displayed after loading
    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
      expect(screen.getByText('D')).toBeInTheDocument();
    });
  });

  test('displays an error message when there are no chats available', async () => {
    require('axios').get.mockResolvedValueOnce({ data: { success: true, chats: [] } });

    render(<Chat />);

    // Check for the "No Chats Available" message
    expect(screen.getByText(/No Chats Available/i)).toBeInTheDocument();
  });

  test('handles sending a message', async () => {
    const mockEmit = jest.fn();
    const mockPost = jest.fn().mockResolvedValue({ data: { success: true } });
    require('socket.io-client').mockReturnValueOnce({ emit: mockEmit });
    require('axios').post.mockImplementationOnce(mockPost);

    render(<Chat />);

    // Find the message input and send button
    const input = screen.getByPlaceholderText(/Message.../i);
    const sendButton = screen.getByRole('button');

    // Simulate user typing a message
    fireEvent.change(input, { target: { value: 'Hello, world!' } });

    // Simulate form submit (send message)
    fireEvent.click(sendButton);

    // Check if the post request was made and socket emit was called
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        'http://localhost/api/chat/addChat/undefined/undefined', // Update with correct URL based on your environment
        { message: 'Hello, world!' }
      );
      expect(mockEmit).toHaveBeenCalledWith(
        'send-msg', 
        { message: 'Hello, world!', username: expect.any(String), _id: expect.any(String), listingId: undefined }
      );
    });
  });

  test('displays error message when sending fails', async () => {
    const mockPost = jest.fn().mockRejectedValueOnce(new Error('Network Error'));
    require('axios').post.mockImplementationOnce(mockPost);

    render(<Chat />);

    const input = screen.getByPlaceholderText(/Message.../i);
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Message could not be sent. Please try again.",
        expect.any(Object)
      );
    });
  });
});
