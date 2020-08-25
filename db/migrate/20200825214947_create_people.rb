class CreatePeople < ActiveRecord::Migration[6.0]
  def change
    create_table :people, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.string :first_name, null: false
      t.string :last_name
      t.timestamps
    end

    add_index :people, [:user_id, :first_name]
  end
end
