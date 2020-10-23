class AddPlaceTypeColumnToPersonPlaces < ActiveRecord::Migration[6.0]
  def change
    remove_column :person_places, :birth_place
    add_column :person_places, :place_type, :string
  end
end
