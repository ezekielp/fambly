class CreateEmails < ActiveRecord::Migration[6.0]
  def change
    create_table :emails, id: :uuid do |t|
      t.references :person, type: :uuid, foreign_key: true
      t.string :email, null: false
      t.string :email_type
      t.timestamps
    end
  end
end
