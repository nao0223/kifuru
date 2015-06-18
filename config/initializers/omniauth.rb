Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV['TW_CON_KEY'],  ENV['TW_CON_SECRET']
end
