class AddBirthdateToPeople < ActiveRecord::Migration[6.0]
  def change
    add_column :people, :months_old, :integer
    add_column :people, :age, :integer
    add_column :people, :birth_year, :integer
    add_column :people, :birth_month, :string
    add_column :people, :birth_day, :integer
  end
end
