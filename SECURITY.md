# Security Policy

## Supported Versions

This is a personal learning and portfolio repository.
Security fixes are applied only on the latest `main` branch.

| Branch / Tag | Supported |
| ------------ | ------------------ |
| `main` | :white_check_mark: |
| older tags (week1, week2, ...) | :x: |

## Reporting a Vulnerability

If you find a security issue (for example, leaked keys, unsafe defaults, or injection risks):

1. **Do not** open a public Issue with sensitive details.
2. Contact the repository owner privately via GitHub:
   - Profile: https://github.com/peeymaann
3. Include:
   - affected file/path
   - steps to reproduce
   - potential impact

You can expect an initial response within a few days when possible.

## Security Notes for This Project

- Never commit real `.env` files or API keys.
- `SUPABASE_SERVICE_ROLE_KEY` and `XAI_API_KEY` must stay server-side only.
- Public forks and pull requests are reviewed before merge.
- This project is for learning; production hardening is limited on purpose.
