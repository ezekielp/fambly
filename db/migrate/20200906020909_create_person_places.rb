class CreatePersonPlaces < ActiveRecord::Migration[6.0]
  def change
    create_table :person_places, id: :uuid do |t|
      t.references :person, type: :uuid, foreign_key: true
      t.references :place, type: :uuid, foreign_key: true
      t.boolean :current, default: false
      t.boolean :birth_place, default: false
      t.integer :start_year
      t.integer :start_month
      t.integer :end_year
      t.integer :end_month
      t.timestamps
    end
  end
end
