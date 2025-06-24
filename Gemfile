source "https://rubygems.org"

# gem "jekyll", "~> 4.2.1"  # Remove this line to let github-pages manage Jekyll version
gem "jekyll-environment-variables"
gem 'wdm', '>= 0.1.0' if Gem.win_platform?
gem "webrick"

gem 'kramdown'
gem 'rack-jekyll', :git => 'https://github.com/adaoraul/rack-jekyll.git'
gem 'rake'

group :jekyll_plugins do
    gem 'jekyll-archives'
    gem "jekyll-paginate"
    gem "github-pages", "~> 232"  # Specify recent version with proper constraint
end

git_source(:github) { |repo_name| "https://github.com/novasecuritynz/site" }
