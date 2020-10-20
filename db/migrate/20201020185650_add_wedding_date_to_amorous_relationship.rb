class AddWeddingDateToAmorousRelationship < ActiveRecord::Migration[6.0]
  def change
    add_column :amorous_relationships, :wedding_year, :integer
    add_column :amorous_relationships, :wedding_month, :integer
    add_column :amorous_relationships, :wedding_day, :integer
  end
end
