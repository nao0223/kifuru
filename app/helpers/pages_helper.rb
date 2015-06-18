module PagesHelper

  def show_status_by_confess confess
    msg_id = case confess.status_for_show
    when Confess::STATUS_SENT
      'msglist.status.waiting'
    when Confess::STATUS_NOT_REPLY
      'msglist.status.noreply'
    when Confess::STATUS_HAS_REPLY
      'msglist.status.hasreply'
    when Confess::STATUS_HAS_REPLIED
      'msglist.status.replied'
    end
    I18n.t(msg_id)
  end
end
