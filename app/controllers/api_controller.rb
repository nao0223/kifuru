class ApiController < ApplicationController
  include HttpRequest
  
  def search_twitter
    res = twitter_client.user(params[:name])
    render json: res
  end

  def send_dm
    # create user
    opponent = User.create_with_session(session)
    # create confess
    confess = Confess.new(
      user_id: current_user.id,
      to_user_id: opponent.id,
      title: I18n.t("selectpage.#{session[:theme]}"),
      status: 0
    )
    try_transaction do
      confess.save!
      message = Message.new(
        user_id: current_user.id,
        confess_id: confess.id,
        content: I18n.t('sendmsg.msg', name: session[:name] )
      )
      message.save!
      # send dm
      twitter_client.create_direct_message(
        opponent.screen_name, 
        "#{message.content}  #{host}/guest/#{confess.id}"
      )
    end
  end

  def reply_dm
    confess = Confess.find(params[:_confessid])
    message = Message.new(
      user_id: confess.to_user_id,
      confess_id: confess.id,
      content: params[:msg] 
    )
    try_transaction do
      message.save!
      confess.replied
      if current_user.try(:auth_token)
        twitter_client.create_direct_message(
          confess.user.screen_name, 
          message.content
        )
      else
        # send mention
        # TODO: create kifuru twitter account
      end
    end
  end

  def account
    current_user.name = params[:name]
    current_user.call_me = params[:callme]
    res = {}
    if current_user.save
      res[:result] = "ok"
    else
      res[:result] = "ng"
      res[:msg] = current_user.error
    end
    render json: res
  end

  private
  def try_transaction &block
    res = {}
    ActiveRecord::Base.transaction do
      block.call
    end
      res['result'] = "ok"
      render json: res
    rescue => e
      res['result'] = "ng"
      res['msg'] = e.message
      render json: res
  end

  def host
    if request.host =~ /localhost/ || request.host =~ /127.0.0/
      "http://#{request.host_with_port}"
    else
      "https://#{request.host}"
    end
  end
end
