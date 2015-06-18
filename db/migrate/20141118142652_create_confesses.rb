class CreateConfesses < ActiveRecord::Migration
  def change
    create_table :confesses do |t|
      t.integer :user_id
      t.integer :to_user_id
      t.integer :contribute_id
      t.integer :environment_id
      t.string :title
      t.integer :status

      t.timestamps
    end
  end
end
