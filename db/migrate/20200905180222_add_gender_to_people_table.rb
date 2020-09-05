class AddGenderToPeopleTable < ActiveRecord::Migration[6.0]
  def change
    add_column :people, :gender, :string
  end
end
