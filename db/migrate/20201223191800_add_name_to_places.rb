class AddNameToPlaces < ActiveRecord::Migration[6.0]
  def change
    add_column :places, :name, :string
  end
end
