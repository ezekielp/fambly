class CreateTrips < ActiveRecord::Migration[6.0]
  def change
    create_table :trips, id: :uuid do |t|
      t.references :user, type: :uuid, foreign_key: true
      t.references :departure_point, type: :uuid, foreign_key: { to_table: :places }
      t.references :end_point, type: :uuid, foreign_key: { to_table: :places }
      t.integer :departure_day
      t.integer :departure_month
      t.integer :departure_year
      t.integer :end_day
      t.integer :end_month
      t.integer :end_year
      t.timestamps
    end
  end
end
