source 'https://rubygems.org'

gem 'rails', '4.1.5'
gem 'uglifier', '>= 1.3.0'
# Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
gem 'spring',        group: :development

# auth
gem 'omniauth'
gem 'omniauth-twitter'

# api
gem 'twitter'
gem 'faraday'

group :production do
    gem 'pg'
    gem 'rails_12factor'
  # Production App Server
  gem 'unicorn'
end

# development, test utilities
group :test, :development do
  gem 'sqlite3'
  gem 'dotenv-rails'

  gem 'pry-rails'
  gem 'pry-doc'
  gem 'pry-stack_explorer'
  gem 'pry-remote'
  gem 'pry-nav'

  gem 'binding_of_caller'

  gem 'tapp'
  gem 'awesome_print'
  gem 'quiet_assets'
end



