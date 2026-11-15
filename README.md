# Useful commands to remember

## Install dependencies

Requires Ruby 3.3+ (see `.ruby-version`) and Node.js 22.18+ (or 24.11+).

```
bundle install
npm install
```

If your shell still picks up macOS' system Ruby 2.6, put Homebrew's Ruby first:

```
PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH" bundle install
```

## Build the JavaScript

The browser scripts in `src/` are compiled into `assets/`:

```
npm run build
```

Commit the regenerated file in `assets/` afterwards.

## Run Jekyll locally:

```
bundle exec jekyll serve
```

## Deployment

GitHub Pages publishes this site from the `master` branch with its legacy
Jekyll builder. That builder uses Jekyll 3.10 and Ruby Sass, so the stylesheets
must stay compatible with Ruby Sass (avoid `@use`, `math.div`, etc.) even
though the local Gemfile uses Jekyll 4.
