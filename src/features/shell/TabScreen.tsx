import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { loadShellLaunchRecord, markShellLaunched } from '@/shared/storage/localSettings';
import { theme } from '@/ui/theme';

type TabScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function TabScreen({ eyebrow, title, description }: TabScreenProps) {
  const [persisted, setPersisted] = useState(false);

  useEffect(() => {
    let alive = true;
    markShellLaunched()
      .then(() => loadShellLaunchRecord())
      .then((record) => {
        if (alive) setPersisted(Boolean(record));
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.marginMobile, paddingBottom: 120 }}>
      <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' }}>{eyebrow}</Text>
      <Text style={{ color: theme.colors.onSurface, fontSize: 32, fontWeight: '700', marginTop: theme.spacing.stackSm }}>{title}</Text>
      <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16, lineHeight: 24, marginTop: theme.spacing.stackMd }}>{description}</Text>
      <View style={{ backgroundColor: theme.colors.surfaceContainer, borderRadius: theme.radius.lg, marginTop: theme.spacing.stackLg, padding: theme.spacing.stackMd }}>
        <Text style={{ color: theme.colors.onSurface, fontSize: 16, fontWeight: '700' }}>Offline foundation</Text>
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 14, lineHeight: 20, marginTop: theme.spacing.stackSm }}>
          {persisted ? 'Local shell metadata persisted.' : 'Preparing local shell metadata…'}
        </Text>
      </View>
    </ScrollView>
  );
}
