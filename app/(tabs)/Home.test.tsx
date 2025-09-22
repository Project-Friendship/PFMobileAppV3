import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Home from './Home';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { router } from 'expo-router';

// Type assertions for mocked modules
const mockedGetCurrentUser = getCurrentUser as jest.Mock;
const mockedSignOut = signOut as jest.Mock;
const mockedRouter = router as jest.Mocked<typeof router>;

describe('Home Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    // Mock getCurrentUser to return a pending promise
    mockedGetCurrentUser.mockReturnValue(new Promise(() => {}));

    const { getByText } = render(<Home />);

    expect(getByText('Loading user data...')).toBeTruthy();
  });

  it('displays username after successful auth', async () => {
    const mockUser = {
      username: 'test_user',
      userId: '123',
      signInDetails: {
        loginId: 'test@example.com'
      }
    };

    mockedGetCurrentUser.mockResolvedValue(mockUser);

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Welcome, test_user!')).toBeTruthy();
      expect(getByText('test@example.com')).toBeTruthy();
    });
  });

  it('displays user not found when no user exists', async () => {
    mockedGetCurrentUser.mockRejectedValue(new Error('No user'));

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('User not found')).toBeTruthy();
    });
  });

  it('handles sign out correctly', async () => {
    const mockUser = {
      username: 'test_user',
      userId: '123',
      signInDetails: {
        loginId: 'test@example.com'
      }
    };

    mockedGetCurrentUser.mockResolvedValue(mockUser);
    mockedSignOut.mockResolvedValue(undefined);

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Welcome, test_user!')).toBeTruthy();
    });

    const signOutButton = getByText('Sign Out');
    fireEvent.press(signOutButton);

    await waitFor(() => {
      expect(mockedSignOut).toHaveBeenCalled();
      expect(mockedRouter.replace).toHaveBeenCalledWith('/');
    });
  });

  it('navigates to events page when events module is pressed', async () => {
    const mockUser = {
      username: 'test_user',
      userId: '123',
      signInDetails: {
        loginId: 'test@example.com'
      }
    };

    mockedGetCurrentUser.mockResolvedValue(mockUser);

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Upcoming Events')).toBeTruthy();
    });

    const eventsModule = getByText('View All Events →');
    fireEvent.press(eventsModule);

    expect(mockedRouter.push).toHaveBeenCalledWith('/events');
  });

  it('navigates to relationships page when notifications module is pressed', async () => {
    const mockUser = {
      username: 'test_user',
      userId: '123',
      signInDetails: {
        loginId: 'test@example.com'
      }
    };

    mockedGetCurrentUser.mockResolvedValue(mockUser);

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Group Notifications')).toBeTruthy();
    });

    const notificationsModule = getByText('View All Notifications →');
    fireEvent.press(notificationsModule);

    expect(mockedRouter.push).toHaveBeenCalledWith('/relationships');
  });

  it('displays all dashboard modules correctly', async () => {
    const mockUser = {
      username: 'test_user',
      userId: '123',
      signInDetails: {
        loginId: 'test@example.com'
      }
    };

    mockedGetCurrentUser.mockResolvedValue(mockUser);

    const { getByText } = render(<Home />);

    await waitFor(() => {
      // Check for Time Log module
      expect(getByText('Time Log')).toBeTruthy();
      expect(getByText('Today')).toBeTruthy();
      expect(getByText('This Week')).toBeTruthy();
      expect(getByText('This Month')).toBeTruthy();

      // Check for Events module
      expect(getByText('Upcoming Events')).toBeTruthy();
      expect(getByText('YMCA')).toBeTruthy();
      expect(getByText('Ice Cream Social')).toBeTruthy();

      // Check for Notifications module
      expect(getByText('Group Notifications')).toBeTruthy();
      expect(getByText('Event location changed for Community Cleanup')).toBeTruthy();
      expect(getByText('Sarah joined your volunteer group')).toBeTruthy();
      expect(getByText('Your time log was approved')).toBeTruthy();
    });
  });

  it('handles sign out error gracefully', async () => {
    const mockUser = {
      username: 'test_user',
      userId: '123',
      signInDetails: {
        loginId: 'test@example.com'
      }
    };

    mockedGetCurrentUser.mockResolvedValue(mockUser);
    mockedSignOut.mockRejectedValue(new Error('Sign out failed'));

    // Mock console.error to check it was called
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Welcome, test_user!')).toBeTruthy();
    });

    const signOutButton = getByText('Sign Out');
    fireEvent.press(signOutButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
    });

    // User should still be displayed since sign out failed
    expect(getByText('Welcome, test_user!')).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });

  it('displays email when available', async () => {
    const mockUser = {
      username: 'test_user',
      userId: '123',
      signInDetails: {
        loginId: 'user@example.com'
      }
    };

    mockedGetCurrentUser.mockResolvedValue(mockUser);

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('user@example.com')).toBeTruthy();
    });
  });

  it('handles missing email gracefully', async () => {
    const mockUser = {
      username: 'test_user',
      userId: '123',
      signInDetails: null
    };

    mockedGetCurrentUser.mockResolvedValue(mockUser);

    const { getByText, queryByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Welcome, test_user!')).toBeTruthy();
      // Email text should be empty string when not available
      const emailTexts = queryByText('');
      expect(emailTexts).toBeTruthy();
    });
  });
});