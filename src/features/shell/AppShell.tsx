import { Text, View } from 'react-native';
import { theme } from '@/ui/theme';

const tabs = ['Today', 'Recipes', 'Beans', 'Gear', 'Lab'];

export function AppShell() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.marginMobile }}>
      <Text style={{ color: theme.colors.onSurface, fontSize: 28, fontWeight: '700' }}>Ngopag</Text>
      <View style={{ marginTop: theme.spacing.stackLg, gap: theme.spacing.stackMd }}>
        {tabs.map((tab) => (
          <Text key={tab} style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>
            {tab}
          </Text>
        ))}
      </View>
    </View>
  );
}
