class RemoveNoteColumnFromParentChild < ActiveRecord::Migration[6.0]
  def change
    remove_column :parent_children, :note
  end
end
