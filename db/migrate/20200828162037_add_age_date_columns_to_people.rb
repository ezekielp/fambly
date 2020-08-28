class AddAgeDateColumnsToPeople < ActiveRecord::Migration[6.0]
  def change
    add_column :people, :date_age_added, :date
  end
end
