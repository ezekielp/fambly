class CreateTripStages < ActiveRecord::Migration[6.0]
  def change
    create_table :trip_stages, id: :uuid do |t|
      t.references :trip, type: :uuid, foreign_key: true
      t.references :place, type: :uuid, foreign_key: true
      t.references :accommodation, type: :uuid, foreign_key: { to_table: :places }
      t.integer :start_day
      t.integer :start_month
      t.integer :start_year
      t.integer :end_day
      t.integer :end_month
      t.integer :end_year
      t.timestamps
    end
  end
end
