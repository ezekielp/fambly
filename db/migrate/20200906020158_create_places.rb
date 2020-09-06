class CreatePlaces < ActiveRecord::Migration[6.0]
  def change
    create_table :places, id: :uuid do |t|
      t.string :country, null: false
      t.string :state_or_region
      t.string :town
      t.string :street
      t.string :zip_code
      t.timestamps
    end
  end
end
