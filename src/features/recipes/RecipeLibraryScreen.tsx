import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { listBeans, type Bean } from '@/features/beans/beanRepository';
import { listGearItems, type GearItem } from '@/features/gear/gearRepository';
import { theme } from '@/ui/theme';
import { createRecipe, getRecipeWithSetupContext, listRecipes, type RecipeWithSetupContext } from './recipeRepository';

export function RecipeLibraryScreen() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [gear, setGear] = useState<GearItem[]>([]);
  const [recipes, setRecipes] = useState<RecipeWithSetupContext[]>([]);
  const [form, setForm] = useState({ name: '', method: '', grindSetting: '' });

  useEffect(() => {
    loadSetup();
  }, []);

  async function loadSetup() {
    const [savedBeans, savedGear, savedRecipes] = await Promise.all([listBeans(), listGearItems(), listRecipes()]);
    setBeans(savedBeans);
    setGear(savedGear);
    setRecipes((await Promise.all(savedRecipes.map((recipe) => getRecipeWithSetupContext(recipe.id)))).filter((recipe): recipe is RecipeWithSetupContext => Boolean(recipe)));
  }

  async function saveRecipe() {
    const bean = beans.at(0);
    const selectedGear = gear.filter((item) => item.type === 'grinder' || item.type === 'brewer');
    const grinder = selectedGear.find((item) => item.type === 'grinder');

    await createRecipe({
      name: form.name,
      method: form.method,
      beanId: bean?.id,
      gearIds: selectedGear.map((item) => item.id),
      grindSetting: grinder && form.grindSetting ? { grinderId: grinder.id, value: form.grindSetting } : undefined,
    });
    await loadSetup();
  }

  const bean = beans.at(0);
  const selectedGear = gear.filter((item) => item.type === 'grinder' || item.type === 'brewer');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.marginMobile, paddingBottom: 120, gap: theme.spacing.stackLg }}>
      <View style={{ gap: theme.spacing.stackSm }}>
        <Text style={eyebrowStyle}>Recipes</Text>
        <Text style={headlineStyle}>Recipes Library</Text>
        <Text style={bodyStyle}>Saved target brews, reusable methods, and setup context for repeatable coffee.</Text>
      </View>

      <View style={cardStyle}>
        <Text style={sectionTitleStyle}>Save a target brew</Text>
        {bean ? <Text style={bodyStyle}>Bean: {bean.roaster} · {bean.name}</Text> : null}
        {selectedGear.length ? <Text style={bodyStyle}>Gear: {selectedGear.map((item) => item.name).join(', ')}</Text> : null}
        <TextInput placeholder="Recipe name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} style={inputStyle} />
        <TextInput placeholder="Method" value={form.method} onChangeText={(method) => setForm({ ...form, method })} style={inputStyle} />
        <TextInput placeholder="Grind setting" value={form.grindSetting} onChangeText={(grindSetting) => setForm({ ...form, grindSetting })} style={inputStyle} />
        <Button label="Save recipe" onPress={saveRecipe} />
      </View>

      <View style={{ gap: theme.spacing.stackMd }}>
        <Text style={sectionTitleStyle}>Saved recipes</Text>
        {recipes.map((recipe) => {
          const grinder = recipe.gear.find((item) => item.id === recipe.recipe.grindSetting?.grinderId);
          return (
            <View key={recipe.recipe.id} style={cardStyle}>
              <Text style={recipeTitleStyle}>{recipe.recipe.name}</Text>
              <Text style={bodyStyle}>{recipe.recipe.method} · {recipe.bean?.roaster} {recipe.bean?.name}</Text>
              {grinder ? <Text style={bodyStyle}>{grinder.name} · {recipe.recipe.grindSetting?.value}</Text> : null}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={{ backgroundColor: theme.colors.primaryContainer, borderRadius: theme.radius.md, padding: theme.spacing.stackMd }}><Text style={{ color: theme.colors.onPrimary, fontWeight: '700', textAlign: 'center' }}>{label}</Text></Pressable>;
}

const eyebrowStyle = { color: theme.colors.primary, fontSize: 12, fontWeight: '700' as const, letterSpacing: 1.4, textTransform: 'uppercase' as const };
const headlineStyle = { color: theme.colors.onSurface, fontSize: 32, fontWeight: '700' as const };
const sectionTitleStyle = { color: theme.colors.onSurface, fontSize: 22, fontWeight: '700' as const };
const recipeTitleStyle = { color: theme.colors.onSurface, fontSize: 18, fontWeight: '700' as const };
const bodyStyle = { color: theme.colors.onSurfaceVariant, fontSize: 16, lineHeight: 24 };
const inputStyle = { backgroundColor: '#fff', borderColor: theme.colors.outline, borderRadius: theme.radius.md, borderWidth: 1, color: theme.colors.onSurface, padding: theme.spacing.stackMd };
const cardStyle = { backgroundColor: theme.colors.surfaceContainer, borderColor: '#d7c2ba', borderRadius: theme.radius.lg, borderWidth: 1, gap: theme.spacing.stackMd, padding: theme.spacing.stackMd };
