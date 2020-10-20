class CreateAmorousRelationships < ActiveRecord::Migration[6.0]
  def change
    create_table :amorous_relationships, id: :uuid do |t|
      t.references :partner_one, type: :uuid, foreign_key: { to_table: :people }
      t.references :partner_two, type: :uuid, foreign_key: { to_table: :people }
      t.boolean :current, default: true
      t.string :relationship_type
      t.integer :start_year
      t.integer :start_month
      t.integer :start_day
      t.integer :end_year
      t.integer :end_month
      t.integer :end_day
      t.timestamps
    end
  end
end
