# @pipeworx/spoonacular

[Spoonacular Food API](https://spoonacular.com/food-api/docs) MCP — recipes, nutrition, ingredients, meal planning. Free 150 req/day.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_SPOONACULAR_KEY`. BYO: `?_apiKey=…`.

## Tools (recipes)

- `recipe_search(query?, cuisine?, excludeCuisine?, diet?, intolerances?, includeIngredients?, excludeIngredients?, type?, instructionsRequired?, fillIngredients?, addRecipeInformation?, addRecipeNutrition?, maxReadyTime?, sort?, sortDirection?, offset?, number?, ...)` — complex search
- `recipe_information(id, includeNutrition?)` — recipe detail
- `recipe_random(tags?, number?)` — random recipes
- `recipe_summary(id)` — short summary
- `recipe_similar(id, number?)` — similar recipes
- `recipe_nutrition(id)` — nutrition breakdown
- `recipe_ingredients(id)` — ingredient list
- `recipe_taste(id, normalize?)` — taste widget
- `recipe_price_breakdown(id)` — cost breakdown

## Tools (ingredients/products)

- `ingredient_search(query, number?, sort?, intolerances?)` — ingredient search
- `ingredient_information(id, amount?, unit?)` — ingredient detail
- `product_search(query, minCalories?, maxCalories?, number?, offset?)` — branded product search
- `product_information(id)` — product detail

## Tools (meal planning + utils)

- `meal_plan_generate(timeFrame?, targetCalories?, diet?, exclude?)` — generated meal plan
- `meal_plan_week(targetCalories?, diet?, exclude?)` — 7-day plan
- `wine_pairing(food, maxPrice?)` — wine pairing
- `wine_recommendation(wine, minRating?, price?, number?)` — wine recommendation
- `convert_amount(ingredientName, sourceAmount, sourceUnit, targetUnit)` — unit conversion

## Data source

`https://api.spoonacular.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "spoonacular": {
      "url": "https://gateway.pipeworx.io/spoonacular/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Spoonacular data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
