class RenameEmailToEmailAddress < ActiveRecord::Migration[6.0]
  def change
    rename_column :emails, :email, :email_address
  end
end
