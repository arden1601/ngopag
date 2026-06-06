import { render } from '@testing-library/react-native';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('shows the five Ngopag tabs', () => {
    const { getByText } = render(<AppShell />);

    expect(getByText('Today')).toBeOnTheScreen();
    expect(getByText('Recipes')).toBeOnTheScreen();
    expect(getByText('Beans')).toBeOnTheScreen();
    expect(getByText('Gear')).toBeOnTheScreen();
    expect(getByText('Lab')).toBeOnTheScreen();
  });
});
