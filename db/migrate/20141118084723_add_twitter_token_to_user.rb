class AddTwitterTokenToUser < ActiveRecord::Migration
  def change
    add_column :users, :auth_token, :string
    add_column :users, :auth_token_secret, :string
  end
end
