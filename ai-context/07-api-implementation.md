# API Implementation

Create route:

/app/api/analyze/route.ts

Use OpenRouter API.

## ENV

OPENROUTER_API_KEY=

## Default Model

anthropic/claude-3.7-sonnet

## Requirements

- POST endpoint
- receive context, goal, message
- inject system prompt
- return parsed JSON
- handle invalid JSON fallback
- handle errors gracefully
- secure server-side key only