class CreateNotes < ActiveRecord::Migration[6.0]
  def change
    create_table :notes, id: :uuid do |t|
      t.references :person, type: :uuid, foreign_key: true
      t.text :content, null: false
      t.timestamps
    end
  end
end
