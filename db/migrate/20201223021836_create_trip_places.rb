class CreateTripPlaces < ActiveRecord::Migration[6.0]
  def change
    create_table :trip_places, id: :uuid do |t|
      t.references :trip_stage, type: :uuid, foreign_key: true
      t.references :place, type: :uuid, foreign_key: true
      t.integer :visit_day
      t.integer :visit_month
      t.integer :visit_year
      t.string :place_type
      t.timestamps
    end
  end
end
