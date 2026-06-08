import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { BeanLibraryScreen } from './BeanLibraryScreen';

describe('BeanLibraryScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('lets a brewer create a bean and a minimal recipe that displays linked bean context', async () => {
    const screen = render(<BeanLibraryScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Roaster'), 'Onyx');
    fireEvent.changeText(screen.getByPlaceholderText('Coffee name'), 'Ethiopia Worka');
    fireEvent.changeText(screen.getByPlaceholderText('Roast date'), '2026-06-02');
    fireEvent.changeText(screen.getByPlaceholderText('Tasting notes'), 'bergamot, honey');
    fireEvent.press(screen.getByText('Save bean'));

    await waitFor(() => expect(screen.getByText('Onyx · Ethiopia Worka')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Recipe name'), 'Morning V60');
    fireEvent.press(screen.getByText('Create recipe with latest bean'));

    await waitFor(() => expect(screen.getByText('Morning V60')).toBeTruthy());
    expect(screen.getByText('Bean: Onyx · Ethiopia Worka')).toBeTruthy();
  });
});
