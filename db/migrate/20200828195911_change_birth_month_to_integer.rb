class ChangeBirthMonthToInteger < ActiveRecord::Migration[6.0]
  def change
    def up
      change_column :people, :birth_month, 'integer USING CAST(birth_month AS integer)'
    end

    def down
      change_column :people, :birth_month, :string
    end
  end
end
