class MakeNotesTablePolymorphic < ActiveRecord::Migration[6.0]
  def change
    remove_column :notes, :person_id
    add_reference :notes, :notable, polymorphic: true
  end
end
