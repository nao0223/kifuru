class User < ActiveRecord::Base
  has_many :confesses

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      user.screen_name = auth['info']['nickname']
      user.name = auth['info']['name']
      user.image_url = auth['info']['image']
      user.auth_token = auth['credentials']['token']
      user.auth_token_secret = auth['credentials']['secret']
    end
  end
  def set_twitter_auth(auth)
    self.auth_token = auth['credentials']['token']
    self.auth_token_secret = auth['credentials']['secret']
    save
  end

  def self.create_with_session(session)
    u = self.find_by_provider_and_uid(session[:provider], session[:uid])
    return u if u
    create! do |user|
      user.provider = session[:provider]
      user.uid = session[:uid]
      user.screen_name = session[:screen_name]
      user.name = session[:name]
      user.image_url = session[:image_url]
    end
  end

  def self.find_relations confesses, current_user_id
    user_ids = confesses.map do |confess|
      confess.user_id == current_user_id ? 
        confess.to_user_id : confess.user_id
    end
    relations = self.where(:id => user_ids)
    to_id_hash(relations)
  end

  def self.to_id_hash users
    result = {}
    users.each do |user|
      result[user.id] = user
    end
    result
  end
end
