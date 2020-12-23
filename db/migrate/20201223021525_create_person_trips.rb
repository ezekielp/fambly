class CreatePersonTrips < ActiveRecord::Migration[6.0]
  def change
    create_table :person_trips, id: :uuid do |t|
      t.references :person, type: :uuid, foreign_key: true
      t.references :trip, type: :uuid, foreign_key: true
      t.timestamps
    end
  end
end
