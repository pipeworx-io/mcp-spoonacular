# @pipeworx/spoonacular

[Spoonacular Food API](https://spoonacular.com/food-api/docs) MCP — recipes, nutrition, ingredients, meal planning. Free 150 req/day.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1679+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/spoonacular/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1679+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/recipe_search \
  -H 'Content-Type: application/json' \
  -d '{"query":"pasta carbonara","number":10}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/recipe_search`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "spoonacular": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-spoonacular"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-spoonacular
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Spoonacular data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
