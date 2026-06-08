import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { GearLibraryScreen } from './GearLibraryScreen';

describe('GearLibraryScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('lets a brewer create gear and a recipe with grinder-aware grind setting', async () => {
    const screen = render(<GearLibraryScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Grinder name'), 'Comandante C40');
    fireEvent.press(screen.getByText('Save grinder'));
    await waitFor(() => expect(screen.getByText('Comandante C40')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Brewer name'), 'Hario V60 02');
    fireEvent.press(screen.getByText('Save brewer'));
    await waitFor(() => expect(screen.getByText('Hario V60 02')).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText('Recipe name'), 'Gear Test V60');
    fireEvent.changeText(screen.getByPlaceholderText('Grind setting'), '22 clicks');
    fireEvent.press(screen.getByText('Create recipe with gear'));

    await waitFor(() => expect(screen.getByText('Gear Test V60')).toBeTruthy());
    expect(screen.getByText('Gear: Comandante C40, Hario V60 02')).toBeTruthy();
    expect(screen.getByText('Grind: 22 clicks on Comandante C40')).toBeTruthy();
  });
});
