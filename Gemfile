source "https://rubygems.org"

ruby ">= 3.3"

# Jekyll 4.x. GitHub Pages' legacy builder ignores this file and uses its own
# pinned Jekyll version, but keeping this current makes local builds work on
# modern Ruby releases.
gem "jekyll", "~> 4.4"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.18"
end

# Jekyll's built-in server needs WEBrick on Ruby 3.x, where it is no longer
# bundled with the standard library.
gem "webrick", "~> 1.9"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
