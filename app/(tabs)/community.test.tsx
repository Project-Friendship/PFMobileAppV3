import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Community from './community';
import { Alert, Linking } from 'react-native';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// Mock the JSON import
jest.mock('../../assets/communitypartners.json', () => [
  {
    title: 'Test Cafe',
    description: 'A cozy cafe downtown',
    tags: 'Entertainment, Snack/Drink, In Town',
    url: 'https://testcafe.com',
    logo: 'https://example.com/logo1.png',
    googlemaps: 'https://maps.google.com/?q=Test+Cafe',
    applemaps: 'https://maps.apple.com/?q=Test+Cafe'
  },
  {
    title: 'Sports Center',
    description: 'Indoor sports facility',
    tags: 'Sports, Carleton',
    url: 'https://sportscenter.com',
    logo: 'https://example.com/logo2.png',
    googlemaps: 'https://maps.google.com/?q=Sports+Center',
    applemaps: 'https://maps.apple.com/?q=Sports+Center'
  },
  {
    title: 'Art Studio',
    description: 'Creative arts and crafts',
    tags: 'Crafts, St. Olaf',
    url: '',
    logo: 'https://example.com/logo3.png',
    googlemaps: 'https://maps.google.com/?q=Art+Studio',
    applemaps: 'https://maps.apple.com/?q=Art+Studio'
  }
]);

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('Community Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUser as jest.Mock).mockRejectedValue(new Error('Signed out'));
  });

  it('renders title and subtitle correctly', () => {
    const { getByText } = render(<Community />);

    expect(getByText('Activities and Community Partners')).toBeTruthy();
    expect(getByText('Bring a Project Friendship VIP card to community partners for deals!')).toBeTruthy();
  });

  it('displays all community partners initially', async () => {
    const { getByText } = render(<Community />);

    await waitFor(() => {
      expect(getByText('Test Cafe')).toBeTruthy();
      expect(getByText('A cozy cafe downtown')).toBeTruthy();
      expect(getByText('Sports Center')).toBeTruthy();
      expect(getByText('Indoor sports facility')).toBeTruthy();
      expect(getByText('Art Studio')).toBeTruthy();
      expect(getByText('Creative arts and crafts')).toBeTruthy();
    });
  });

  it('renders all locational tag buttons', () => {
    const { getByText } = render(<Community />);

    expect(getByText('Carleton')).toBeTruthy();
    expect(getByText('St. Olaf')).toBeTruthy();
    expect(getByText('In Town')).toBeTruthy();
  });

  it('renders all descriptive tag buttons', () => {
    const { getByText } = render(<Community />);

    expect(getByText('Entertainment')).toBeTruthy();
    expect(getByText('Games')).toBeTruthy();
    expect(getByText('Crafts')).toBeTruthy();
    expect(getByText('Snack/Drink')).toBeTruthy();
    expect(getByText('Sports')).toBeTruthy();
    expect(getByText('Winter Sports')).toBeTruthy();
  });

  it('filters partners by descriptive tag', async () => {
    const { getByText, queryByText } = render(<Community />);

    const sportsTag = getByText('Sports');
    fireEvent.press(sportsTag);

    await waitFor(() => {
      expect(getByText('Sports Center')).toBeTruthy();
      expect(queryByText('Test Cafe')).toBeNull();
      expect(queryByText('Art Studio')).toBeNull();
    });
  });

  it('filters partners by locational tag', async () => {
    const { getByText, queryByText } = render(<Community />);

    const inTownTag = getByText('In Town');
    fireEvent.press(inTownTag);

    await waitFor(() => {
      expect(getByText('Test Cafe')).toBeTruthy();
      expect(queryByText('Sports Center')).toBeNull();
      expect(queryByText('Art Studio')).toBeNull();
    });
  });

  it('filters partners by multiple tags (AND logic)', async () => {
    const { getByText, queryByText } = render(<Community />);

    const entertainmentTag = getByText('Entertainment');
    const inTownTag = getByText('In Town');
    
    fireEvent.press(entertainmentTag);
    fireEvent.press(inTownTag);

    await waitFor(() => {
      expect(getByText('Test Cafe')).toBeTruthy();
      expect(queryByText('Sports Center')).toBeNull();
      expect(queryByText('Art Studio')).toBeNull();
    });
  });

  it('toggles tag selection on and off', async () => {
    const { getByText, queryByText } = render(<Community />);

    const craftsTag = getByText('Crafts');
    
    // Select tag
    fireEvent.press(craftsTag);

    await waitFor(() => {
      expect(getByText('Art Studio')).toBeTruthy();
      expect(queryByText('Test Cafe')).toBeNull();
    });

    // Deselect tag
    fireEvent.press(craftsTag);

    await waitFor(() => {
      expect(getByText('Test Cafe')).toBeTruthy();
      expect(getByText('Sports Center')).toBeTruthy();
      expect(getByText('Art Studio')).toBeTruthy();
    });
  });

  it('opens URL when partner name with link is pressed', async () => {
    const { getByText } = render(<Community />);

    await waitFor(() => {
      expect(getByText('Test Cafe')).toBeTruthy();
    });

    const partnerName = getByText('Test Cafe');
    fireEvent.press(partnerName);

    expect(Linking.openURL).toHaveBeenCalledWith('https://testcafe.com');
  });

  it('does not open URL when partner has no link', async () => {
    const { getByText } = render(<Community />);

    await waitFor(() => {
      expect(getByText('Art Studio')).toBeTruthy();
    });

    const partnerName = getByText('Art Studio');
    fireEvent.press(partnerName);

    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('shows map selection alert when location icon is pressed', async () => {
    const { getAllByTestId, getByText } = render(<Community />);

    await waitFor(() => {
      expect(getByText('Test Cafe')).toBeTruthy();
    });

    fireEvent.press(getAllByTestId('nav-icon-container-0')[0]);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Choose a mapping app',
      undefined,
      expect.arrayContaining([expect.objectContaining({ text: 'Google Maps' })]),
      { cancelable: true },
    );
  });

  // it('opens Google Maps when selected from alert', async () => {
  //   const { getByText } = render(<Community />);

  //   await waitFor(() => {
  //     expect(getByText('Test Cafe')).toBeTruthy();
  //   });

  //   // Trigger the alert by testing the openMaps logic
  //   Alert.alert(
  //     "Choose a mapping app",
  //     undefined,
  //     [
  //       {
  //         text: "Google Maps",
  //         onPress: () => Linking.openURL('https://maps.google.com/?q=Test+Cafe')
  //       },
  //       {
  //         text: "Apple Maps",
  //         onPress: () => Linking.openURL('https://maps.apple.com/?q=Test+Cafe')
  //       },
  //       {
  //         text: "Cancel",
  //       }
  //     ]
  //   );

  //   expect(Alert.alert).toHaveBeenCalledWith(
	// 	"Choose a mapping app",
	// 	undefined,
	// 	expect.arrayContaining([
	// 	expect.objectContaining({ text: "Google Maps" }),
	// 	expect.objectContaining({ text: "Apple Maps" }),
	// 	expect.objectContaining({ text: "Cancel" })
	// 	]),
	// 	expect.objectContaining({ cancelable: true })
	// );
  // });

  // it('handles Linking errors gracefully', async () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  //   (Linking.openURL as jest.Mock).mockRejectedValueOnce(new Error('Could not open'));

  //   const { getByText } = render(<Community />);

  //   await waitFor(() => {
  //     expect(getByText('Test Cafe')).toBeTruthy();
  //   });

  //   const partnerName = getByText('Test Cafe');
  //   fireEvent.press(partnerName);

  //   await waitFor(() => {
  //     expect(consoleErrorSpy).toHaveBeenCalled();
  //   });

  //   consoleErrorSpy.mockRestore();
  // });

  it('shows all partners when no tags are selected', async () => {
    const { getByText } = render(<Community />);

    await waitFor(() => {
      expect(getByText('Test Cafe')).toBeTruthy();
      expect(getByText('Sports Center')).toBeTruthy();
      expect(getByText('Art Studio')).toBeTruthy();
    });
  });

  it('handles partners with multiple tags correctly', async () => {
    const { getByText, queryByText } = render(<Community />);

    // Test Cafe has both "Entertainment" and "Snack/Drink"
    const entertainmentTag = getByText('Entertainment');
    fireEvent.press(entertainmentTag);

    await waitFor(() => {
      expect(getByText('Test Cafe')).toBeTruthy();
    });

    const snackTag = getByText('Snack/Drink');
    fireEvent.press(snackTag);

    await waitFor(() => {
      // Should still show Test Cafe as it matches both
      expect(getByText('Test Cafe')).toBeTruthy();
    });
  });
});

// Check the app's own API behavior with deterministic responses, not a demo service.
describe('Community check-in', () => {
  const originalFetch = global.fetch;
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
    (getCurrentUser as jest.Mock).mockResolvedValue({ username: 'test-user', userId: 'user-123' });
    (fetchAuthSession as jest.Mock).mockResolvedValue({
      tokens: { idToken: { toString: () => 'test-id-token' } },
    });
  });

  afterEach(() => { global.fetch = originalFetch; });

  it('sends the authenticated check-in and confirms success', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ saved: true }) });
    const { getByTestId } = render(<Community />);
    await waitFor(() => expect(getCurrentUser).toHaveBeenCalled());
    fireEvent.press(getByTestId('check-in-button-0'));
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith(
      'Checked In!', expect.stringContaining('Test Cafe'), [{ text: 'OK' }],
    ));
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/community$/), {
      method: 'POST',
      headers: { Authorization: 'Bearer test-id-token', 'Content-Type': 'application/json' },
      body: expect.any(String),
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      userId: 'user-123', partnerId: 'Test Cafe', timestamp: expect.any(String),
    });
  });

  it('reports backend failure and permits retry', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    fetchMock.mockResolvedValueOnce({ ok: false, statusText: 'Bad Request', json: async () => ({ message: 'Try again' }) });
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ saved: true }) });
    try {
      const { getByTestId } = render(<Community />);
      await waitFor(() => expect(getCurrentUser).toHaveBeenCalled());
      fireEvent.press(getByTestId('check-in-button-0'));
      await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Check-In Failed', 'Try again', [{ text: 'OK' }]));
      fireEvent.press(getByTestId('check-in-button-0'));
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
      await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Checked In!', expect.any(String), [{ text: 'OK' }]));
    } finally { errorSpy.mockRestore(); }
  });

  it('does not submit check-ins while signed out', async () => {
    (getCurrentUser as jest.Mock).mockRejectedValue(new Error('Signed out'));
    const { getByTestId } = render(<Community />);
    await waitFor(() => expect(getCurrentUser).toHaveBeenCalled());
    fireEvent.press(getByTestId('check-in-button-0'));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'User not authenticated. Please log in to check in.');
  });
});
