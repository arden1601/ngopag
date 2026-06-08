import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { createRecipe, getRecipeWithSetupContext, type RecipeWithSetupContext } from '@/features/recipes/recipeRepository';
import { theme } from '@/ui/theme';
import { createGearItem, listGearItems, type GearItem } from './gearRepository';

export function GearLibraryScreen() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [grinderName, setGrinderName] = useState('');
  const [brewerName, setBrewerName] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [grindSetting, setGrindSetting] = useState('');
  const [recipeContext, setRecipeContext] = useState<RecipeWithSetupContext | null>(null);

  useEffect(() => {
    listGearItems().then(setGear);
  }, []);

  async function saveGrinder() {
    await createGearItem({ type: 'grinder', name: grinderName });
    setGear(await listGearItems());
  }

  async function saveBrewer() {
    await createGearItem({ type: 'brewer', name: brewerName });
    setGear(await listGearItems());
  }

  async function saveRecipe() {
    const grinder = gear.find((item) => item.type === 'grinder');
    const selectedGear = gear.filter((item) => item.type === 'grinder' || item.type === 'brewer');
    if (!grinder || selectedGear.length === 0) return;

    const recipe = await createRecipe({
      name: recipeName,
      method: 'V60',
      gearIds: selectedGear.map((item) => item.id),
      grindSetting: { grinderId: grinder.id, value: grindSetting },
    });
    setRecipeContext(await getRecipeWithSetupContext(recipe.id));
  }

  const grinder = recipeContext?.gear.find((item) => item.id === recipeContext.recipe.grindSetting?.grinderId);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.marginMobile, paddingBottom: 120, gap: theme.spacing.stackMd }}>
      <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' }}>Gear</Text>
      <Text style={{ color: theme.colors.onSurface, fontSize: 32, fontWeight: '700' }}>Equipment library</Text>
      <TextInput placeholder="Grinder name" value={grinderName} onChangeText={setGrinderName} style={inputStyle} />
      <Button label="Save grinder" onPress={saveGrinder} />
      <TextInput placeholder="Brewer name" value={brewerName} onChangeText={setBrewerName} style={inputStyle} />
      <Button label="Save brewer" onPress={saveBrewer} />
      {gear.map((item) => <Text key={item.id} style={bodyStyle}>{item.name}</Text>)}
      <TextInput placeholder="Recipe name" value={recipeName} onChangeText={setRecipeName} style={inputStyle} />
      <TextInput placeholder="Grind setting" value={grindSetting} onChangeText={setGrindSetting} style={inputStyle} />
      <Button label="Create recipe with gear" onPress={saveRecipe} />
      {recipeContext ? (
        <View style={cardStyle}>
          <Text style={titleStyle}>{recipeContext.recipe.name}</Text>
          <Text style={bodyStyle}>Gear: {recipeContext.gear.map((item) => item.name).join(', ')}</Text>
          <Text style={bodyStyle}>Grind: {recipeContext.recipe.grindSetting?.value} on {grinder?.name}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={{ backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.md, padding: theme.spacing.stackMd }}><Text style={{ color: theme.colors.onPrimary, fontWeight: '700', textAlign: 'center' }}>{label}</Text></Pressable>;
}

const inputStyle = { backgroundColor: '#fff', borderColor: theme.colors.outline, borderRadius: theme.radius.md, borderWidth: 1, color: theme.colors.onSurface, padding: theme.spacing.stackMd };
const cardStyle = { backgroundColor: theme.colors.surfaceContainer, borderRadius: theme.radius.lg, padding: theme.spacing.stackMd };
const titleStyle = { color: theme.colors.onSurface, fontSize: 18, fontWeight: '700' as const };
const bodyStyle = { color: theme.colors.onSurfaceVariant, fontSize: 16, lineHeight: 24 };
