class PagesController < ApplicationController
  before_action :fetch_confess, :only => [:guest_top, :guest_show_msg, :guest_reply_msg] 
  before_action :login_required, :except => [:guest_top, :guest_show_msg, :guest_reply_msg]

  def select_target
    session[:theme] = params[:theme]
  end

  def create_msg
    session[:provider] = params[:target_provider]
    session[:uid] = params[:target_twi_id]
    session[:screen_name] = params[:target_id]
    session[:name] = params[:target_name]
    session[:image_url] = params[:target_image]
  
     
    p session[:theme]
    @theme = session[:theme] 

    if session[:theme] == "love" then
    @poem = I18n.t("createmsg.poem.confess.love.casual.poem1")

    elsif session[:theme] == "date" then
    @poem = I18n.t("createmsg.poem.sorry.tellme.casual.poem1")

    elsif session[:theme] == "propose" then
    @poem = I18n.t("createmsg.poem.sorry.drink.casual.poem1")

    elsif session[:theme] == "late" then
    @poem = I18n.t("createmsg.poem.sorry.late.casual.poem1")
    
    else
    @poem = I18n.t("createmsg.poem.sorry.rest.casual.poem1")
    
    end

    p @poem
  end

  def guest_top
    @from = @confess.user
    @to = User.find(@confess.to_user_id)
  end

  def guest_show_msg
    @confess.mark_as_read true
  end

  def guest_reply_msg
    @from = @confess.user
  end

  def msg_list
    # fetch all confesses 
    confesses = current_user.confesses.to_a
    confesses.concat(Confess.where(to_user_id: current_user.id).to_a)
    confesses = confesses.to_a.sort{|a, b| b.updated_at <=> a.updated_at}
    # fetch all related users excepted me
    relations = User.find_relations(confesses, current_user.id)
    
    @new_confesses, @old_confesses = [], []
    confesses.each do | confess |
      status, relation = confess.filter_state(current_user, relations)
      wrap = {confess: confess, relation: relation}
      case status
      when Confess::STATUS_OLD
        @old_confesses << wrap
      when Confess::STATUS_NEW
        @new_confesses << wrap
      end
    end
  end

  def show_msg_sent
    @confess = Confess.find(params[:selected_id])
    @confess.mark_as_read true
    users = User.to_id_hash(User.where(:id => [@confess.user_id, @confess.to_user_id]))
    messages = @confess.messages
    @view_set = []
    messages.each do | message |
      wrap = {}
      wrap[:user] = users[message.user_id]
      wrap[:message] = message
      wrap[:is_from] = message.user_id == current_user.id
      @view_set << wrap
    end
  end

  private
  def fetch_confess
    begin
      @confess = Confess.find(params[:_confessid])
    rescue => e
      p e.message
      #TODO error handlin
    end
  end
end
