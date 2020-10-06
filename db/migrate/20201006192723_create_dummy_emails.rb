class CreateDummyEmails < ActiveRecord::Migration[6.0]
  def change
    create_table :dummy_emails, id: :uuid do |t|
      t.string :email, null: false
      t.references :user, type: :uuid, foreign_key: true
      t.timestamps
    end
  end
end
