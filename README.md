# mcp-spoonacular

Spoonacular food API: recipes, nutrition, ingredients, meal plans. Free 150/day.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `ingredient_search` | Ingredient search. |
| `ingredient_information` | Ingredient detail. |
| `product_search` | Branded product search. |
| `wine_recommendation` | Wine recommendation. |
| `convert_amount` | Unit conversion. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
