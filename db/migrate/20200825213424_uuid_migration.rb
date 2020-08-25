require 'webdack/uuid_migration/helpers'

class UuidMigration < ActiveRecord::Migration[6.0]
  def change
    reversible do |dir|
      dir.up do
        enable_extension 'pgcrypto'

        primary_key_to_uuid :users
      end

      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
