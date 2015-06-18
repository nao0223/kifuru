class AddIsReadToConfess < ActiveRecord::Migration
  def change
    add_column :confesses, :is_read, :boolean, default: false
  end
end
