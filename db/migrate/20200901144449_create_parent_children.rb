class CreateParentChildren < ActiveRecord::Migration[6.0]
  def change
    create_table :parent_children, id: :uuid do |t|
      t.references :parent, type: :uuid, foreign_key: { to_table: :people }
      t.references :child, type: :uuid, foreign_key: { to_table: :people }
      t.string :parent_type
      t.text :note
      t.timestamps
    end
  end
end
