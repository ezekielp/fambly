class ChangePeopleTableToReferenceUsersTable < ActiveRecord::Migration[6.0]
  def change
    remove_column :people, :user_id
    add_reference :people, :user, type: :uuid, foreign_key: true
  end
end
