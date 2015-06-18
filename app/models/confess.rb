class Confess < ActiveRecord::Base

  belongs_to :user
  has_many :messages
  after_create :set_default_status
  attr_accessor :status_for_show

  # for status column
  STATUS_CREATED = 0
  STATUS_REPLIED = 1
  # for status_for_show
  STATUS_SENT = 0         # 返信待ち
  STATUS_NOT_REPLY = 1    # 未返信
  STATUS_HAS_REPLY = 2    # 返信あり
  STATUS_HAS_REPLIED = 3  # 返信済み
  # 新着か既読か
  STATUS_NEW = 0
  STATUS_OLD = 1

  def mark_as_read is_read
    self.is_read = is_read
    save
  end

  def replied
    self.status = STATUS_REPLIED
    mark_as_read false
  end

  def filter_state user, relations
    case self.status
    when STATUS_CREATED
      if from_him? user 
        self.status_for_show = STATUS_SENT
        return STATUS_OLD, relations[self.to_user_id]
      else
        self.status_for_show = STATUS_NOT_REPLY
        if self.is_read 
          return STATUS_OLD, relations[self.user_id] 
        else
          return STATUS_NEW, relations[self.user_id]
        end
      end
    when STATUS_REPLIED
      if from_him? user 
        self.status_for_show = STATUS_HAS_REPLY
        if self.is_read 
          return STATUS_OLD, relations[self.to_user_id] 
        else
          return STATUS_NEW, relations[self.to_user_id]
        end
      else
        self.status_for_show = STATUS_HAS_REPLIED
        return STATUS_OLD, relations[self.user_id]
      end
    end
  end

  private
  def set_default_status
    puts "called set_default_status"
    self.status = STATUS_CREATED
  end

  def from_him? user
    self.user_id == user.id
  end

end
