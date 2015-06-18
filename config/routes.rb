Rails.application.routes.draw do
  root 'top#index'
  get '/guest/:id' => 'top#guest'
  get '/msgbox' => 'top#message'
  get '/account' => 'top#account'

  get '/auth/:provider/callback', :to => 'sessions#callback'
  post '/auth/:provider/callback', :to => 'sessions#callback'

  pages = %w{ _sidebar create-msg guest-reply-msg guest-show-msg guest-top msg-list 
              profile select-target select-template send-msg show-msg-sent toppage}
  pages.each do | page |
    get "pages/#{page}" => "pages##{page.gsub("-", "_")}"
  end

  get 'api/twitter/:name' => "api#search_twitter"
  post 'api/dm' => "api#send_dm"
  post 'api/reply' => "api#reply_dm"
  post 'api/account' => "api#account"

end
