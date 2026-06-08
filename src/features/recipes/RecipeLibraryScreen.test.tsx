import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { createBean } from '@/features/beans/beanRepository';
import { createGearItem } from '@/features/gear/gearRepository';
import { RecipeLibraryScreen } from './RecipeLibraryScreen';

describe('RecipeLibraryScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('lets a brewer save a recipe from the recipe library using saved bean and gear context', async () => {
    await createBean({
      roaster: 'Onyx',
      name: 'Ethiopia Worka',
      roastDate: '2026-06-02',
      roastLevel: 'light',
      tastingNotes: ['bergamot', 'honey'],
      inventoryStatus: 'available',
    });
    await createGearItem({ type: 'grinder', name: 'Comandante C40' });
    await createGearItem({ type: 'brewer', name: 'Hario V60 02' });

    const screen = render(<RecipeLibraryScreen />);

    await waitFor(() => expect(screen.getByText('Recipes Library')).toBeTruthy());
    expect(screen.getByText('Save a target brew')).toBeTruthy();
    expect(screen.getByText('Bean: Onyx · Ethiopia Worka')).toBeTruthy();
    expect(screen.getByText('Gear: Comandante C40, Hario V60 02')).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('Recipe name'), 'Morning V60');
    fireEvent.changeText(screen.getByPlaceholderText('Method'), 'V60');
    fireEvent.changeText(screen.getByPlaceholderText('Grind setting'), '22 clicks');
    fireEvent.press(screen.getByText('Save recipe'));

    await waitFor(() => expect(screen.getByText('Morning V60')).toBeTruthy());
    expect(screen.getByText('V60 · Onyx Ethiopia Worka')).toBeTruthy();
    expect(screen.getByText('Comandante C40 · 22 clicks')).toBeTruthy();
  });
});
