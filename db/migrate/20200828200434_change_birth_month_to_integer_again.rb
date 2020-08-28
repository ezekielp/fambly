class ChangeBirthMonthToIntegerAgain < ActiveRecord::Migration[6.0]
  def change
    remove_column :people, :birth_month
    add_column :people, :birth_month, :integer
  end
end
