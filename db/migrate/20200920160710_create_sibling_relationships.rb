class CreateSiblingRelationships < ActiveRecord::Migration[6.0]
  def change
    create_table :sibling_relationships, id: :uuid do |t|
      t.references :sibling_one, type: :uuid, foreign_key: { to_table: :people }
      t.references :sibling_two, type: :uuid, foreign_key: { to_table: :people }
      t.string :sibling_type
      t.timestamps
    end
  end
end
