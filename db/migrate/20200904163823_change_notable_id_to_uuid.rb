require 'webdack/uuid_migration/helpers'

class ChangeNotableIdToUuid < ActiveRecord::Migration[6.0]
  def change
    reversible do |dir|
      dir.up do
        enable_extension 'pgcrypto'

        columns_to_uuid :notes, :notable_id
      end

      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
