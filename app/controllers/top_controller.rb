class TopController < ApplicationController
  before_action :login_required, only: [:index, :message]
end
