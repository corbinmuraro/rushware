class CreateSignins < ActiveRecord::Migration[5.0]
  def change
    create_table :signins do |t|
      t.string :picture

      t.timestamps
    end
  end
end
