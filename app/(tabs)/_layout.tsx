import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { theme } from '@/ui/theme';

const icons = {
  index: 'today-outline',
  recipes: 'book-outline',
  beans: 'leaf-outline',
  gear: 'cafe-outline',
  lab: 'flask-outline',
} as const;

type TabName = keyof typeof icons;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryContainer,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surfaceContainer,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name as TabName]} size={size} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recipes' }} />
      <Tabs.Screen name="beans" options={{ title: 'Beans' }} />
      <Tabs.Screen name="gear" options={{ title: 'Gear' }} />
      <Tabs.Screen name="lab" options={{ title: 'Lab' }} />
    </Tabs>
  );
}
