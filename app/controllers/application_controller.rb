class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  skip_before_filter :verify_authenticity_token

  before_action :set_locale

  def login_required
    begin
      @current_user = User.find(session[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      redirect_to "/auth/twitter"
    end
  end

  def set_locale
    I18n.locale = extract_locale_from_accept_language_header
  end
 
  helper_method :current_user
  private
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def extract_locale_from_accept_language_header
    request.env['HTTP_ACCEPT_LANGUAGE'].scan(/^[a-z]{2}/).first
  end

end
