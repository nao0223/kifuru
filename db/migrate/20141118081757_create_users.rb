class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :provider, null: false
      t.string :uid, null: false
      t.string :screen_name
      t.string :name
      t.integer :gender, default: 1
      t.string :image_url
      t.integer :point, default: 0
      t.string :call_me

      t.timestamps
    end
  end
end
