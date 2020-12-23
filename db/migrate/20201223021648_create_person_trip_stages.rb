class CreatePersonTripStages < ActiveRecord::Migration[6.0]
  def change
    create_table :person_trip_stages, id: :uuid do |t|
      t.references :person, type: :uuid, foreign_key: true
      t.references :trip_stage, type: :uuid, foreign_key: true
      t.timestamps
    end
  end
end
