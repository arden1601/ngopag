import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { createRecipe, getRecipeWithBeanContext, type RecipeWithBeanContext } from '@/features/recipes/recipeRepository';
import { theme } from '@/ui/theme';
import { createBean, listBeans, type Bean } from './beanRepository';

export function BeanLibraryScreen() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [recipeName, setRecipeName] = useState('');
  const [recipeContext, setRecipeContext] = useState<RecipeWithBeanContext | null>(null);
  const [form, setForm] = useState({ roaster: '', name: '', roastDate: '', tastingNotes: '' });

  useEffect(() => {
    listBeans().then(setBeans);
  }, []);

  async function saveBean() {
    const bean = await createBean({
      roaster: form.roaster,
      name: form.name,
      roastDate: form.roastDate,
      roastLevel: 'light',
      tastingNotes: form.tastingNotes.split(',').map((note) => note.trim()).filter(Boolean),
      inventoryStatus: 'available',
    });
    setBeans((current) => [...current, bean]);
  }

  async function saveRecipe() {
    const bean = beans.at(-1);
    if (!bean) return;
    const recipe = await createRecipe({ name: recipeName, method: 'V60', beanId: bean.id });
    setRecipeContext(await getRecipeWithBeanContext(recipe.id));
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.marginMobile, paddingBottom: 120, gap: theme.spacing.stackMd }}>
      <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' }}>Beans</Text>
      <Text style={{ color: theme.colors.onSurface, fontSize: 32, fontWeight: '700' }}>Bean inventory</Text>
      <TextInput placeholder="Roaster" value={form.roaster} onChangeText={(roaster) => setForm({ ...form, roaster })} style={inputStyle} />
      <TextInput placeholder="Coffee name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} style={inputStyle} />
      <TextInput placeholder="Roast date" value={form.roastDate} onChangeText={(roastDate) => setForm({ ...form, roastDate })} style={inputStyle} />
      <TextInput placeholder="Tasting notes" value={form.tastingNotes} onChangeText={(tastingNotes) => setForm({ ...form, tastingNotes })} style={inputStyle} />
      <Button label="Save bean" onPress={saveBean} />
      {beans.map((bean) => <Text key={bean.id} style={bodyStyle}>{bean.roaster} · {bean.name}</Text>)}
      <TextInput placeholder="Recipe name" value={recipeName} onChangeText={setRecipeName} style={inputStyle} />
      <Button label="Create recipe with latest bean" onPress={saveRecipe} />
      {recipeContext ? <View style={cardStyle}><Text style={titleStyle}>{recipeContext.recipe.name}</Text><Text style={bodyStyle}>Bean: {recipeContext.bean?.roaster} · {recipeContext.bean?.name}</Text></View> : null}
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
