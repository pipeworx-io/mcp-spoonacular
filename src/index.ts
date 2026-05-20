interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Spoonacular MCP.
 */


const BASE = 'https://api.spoonacular.com';
const UA = 'pipeworx-mcp-spoonacular/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'recipe_search', description: 'Complex recipe search.', inputSchema: { type: 'object', properties: {}, additionalProperties: true } },
  { name: 'recipe_information', description: 'Recipe detail.', inputSchema: { type: 'object', properties: { id: { type: 'number' }, includeNutrition: { type: 'boolean' } }, required: ['id'] } },
  { name: 'recipe_random', description: 'Random recipes.', inputSchema: { type: 'object', properties: { tags: { type: 'string' }, number: { type: 'number' } } } },
  { name: 'recipe_summary', description: 'Short summary.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'recipe_similar', description: 'Similar recipes.', inputSchema: { type: 'object', properties: { id: { type: 'number' }, number: { type: 'number' } }, required: ['id'] } },
  { name: 'recipe_nutrition', description: 'Nutrition breakdown.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'recipe_ingredients', description: 'Ingredient list.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'recipe_taste', description: 'Taste widget.', inputSchema: { type: 'object', properties: { id: { type: 'number' }, normalize: { type: 'boolean' } }, required: ['id'] } },
  { name: 'recipe_price_breakdown', description: 'Cost breakdown.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  {
    name: 'ingredient_search',
    description: 'Ingredient search.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, number: { type: 'number' }, sort: { type: 'string' }, intolerances: { type: 'string' } }, required: ['query'] },
  },
  {
    name: 'ingredient_information',
    description: 'Ingredient detail.',
    inputSchema: { type: 'object', properties: { id: { type: 'number' }, amount: { type: 'number' }, unit: { type: 'string' } }, required: ['id'] },
  },
  {
    name: 'product_search',
    description: 'Branded product search.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, minCalories: { type: 'number' }, maxCalories: { type: 'number' }, number: { type: 'number' }, offset: { type: 'number' } }, required: ['query'] },
  },
  { name: 'product_information', description: 'Product detail.', inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } },
  { name: 'meal_plan_generate', description: 'Generated meal plan.', inputSchema: { type: 'object', properties: { timeFrame: { type: 'string' }, targetCalories: { type: 'number' }, diet: { type: 'string' }, exclude: { type: 'string' } } } },
  { name: 'meal_plan_week', description: '7-day plan.', inputSchema: { type: 'object', properties: { targetCalories: { type: 'number' }, diet: { type: 'string' }, exclude: { type: 'string' } } } },
  { name: 'wine_pairing', description: 'Wine pairing.', inputSchema: { type: 'object', properties: { food: { type: 'string' }, maxPrice: { type: 'number' } }, required: ['food'] } },
  {
    name: 'wine_recommendation',
    description: 'Wine recommendation.',
    inputSchema: { type: 'object', properties: { wine: { type: 'string' }, minRating: { type: 'number' }, price: { type: 'string' }, number: { type: 'number' } }, required: ['wine'] },
  },
  {
    name: 'convert_amount',
    description: 'Unit conversion.',
    inputSchema: {
      type: 'object',
      properties: { ingredientName: { type: 'string' }, sourceAmount: { type: 'number' }, sourceUnit: { type: 'string' }, targetUnit: { type: 'string' } },
      required: ['ingredientName', 'sourceAmount', 'sourceUnit', 'targetUnit'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Spoonacular requires an API key. Set PLATFORM_SPOONACULAR_KEY or pass ?_apiKey=… (free at https://spoonacular.com/food-api).');
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams({ apiKey });
    if (params) for (const [k, v] of Object.entries(params)) if (k !== '_apiKey' && v != null) p.set(k, String(v));
    const res = await fetch(`${BASE}${path}?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 401 || res.status === 403) throw new Error('Spoonacular: invalid API key.');
    if (res.status === 402) throw new Error('Spoonacular: 402 — daily points quota exhausted.');
    if (!res.ok) throw new Error(`Spoonacular: ${res.status}`);
    return res.json();
  };
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'recipe_search':
      return get('/recipes/complexSearch', args);
    case 'recipe_information':
      return get(`/recipes/${reqNum('id', '716429')}/information`, { includeNutrition: args.includeNutrition });
    case 'recipe_random':
      return get('/recipes/random', args);
    case 'recipe_summary':
      return get(`/recipes/${reqNum('id', '716429')}/summary`);
    case 'recipe_similar':
      return get(`/recipes/${reqNum('id', '716429')}/similar`, { number: args.number });
    case 'recipe_nutrition':
      return get(`/recipes/${reqNum('id', '716429')}/nutritionWidget.json`);
    case 'recipe_ingredients':
      return get(`/recipes/${reqNum('id', '716429')}/ingredientWidget.json`);
    case 'recipe_taste':
      return get(`/recipes/${reqNum('id', '716429')}/tasteWidget.json`, { normalize: args.normalize });
    case 'recipe_price_breakdown':
      return get(`/recipes/${reqNum('id', '716429')}/priceBreakdownWidget.json`);
    case 'ingredient_search':
      return get('/food/ingredients/search', args);
    case 'ingredient_information':
      return get(`/food/ingredients/${reqNum('id', '9266')}/information`, { amount: args.amount, unit: args.unit });
    case 'product_search':
      return get('/food/products/search', args);
    case 'product_information':
      return get(`/food/products/${reqNum('id', '22347')}`);
    case 'meal_plan_generate':
      return get('/mealplanner/generate', args);
    case 'meal_plan_week':
      return get('/mealplanner/generate', { timeFrame: 'week', ...args });
    case 'wine_pairing':
      return get('/food/wine/pairing', args);
    case 'wine_recommendation':
      return get('/food/wine/recommendation', args);
    case 'convert_amount':
      return get('/recipes/convert', {
        ingredientName: reqStr('ingredientName', '"flour"'),
        sourceAmount: reqNum('sourceAmount', '1'),
        sourceUnit: reqStr('sourceUnit', '"cup"'),
        targetUnit: reqStr('targetUnit', '"grams"'),
      });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
