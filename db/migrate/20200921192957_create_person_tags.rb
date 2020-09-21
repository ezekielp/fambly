class CreatePersonTags < ActiveRecord::Migration[6.0]
  def change
    create_table :person_tags, id: :uuid do |t|
      t.references :person, type: :uuid, foreign_key: true
      t.references :tag, type: :uuid, foreign_key: true
      t.timestamps
    end
  end
end
