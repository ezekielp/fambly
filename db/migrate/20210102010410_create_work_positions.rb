class CreateWorkPositions < ActiveRecord::Migration[6.0]
  def change
    create_table :work_positions, id: :uuid do |t|
      t.references :person, type: :uuid, foreign_key: true
      t.references :place, type: :uuid, foreign_key: true
      t.boolean :current
      t.string :title
      t.string :company_name
      t.text :description
      t.integer :start_month
      t.integer :start_year
      t.integer :end_month
      t.integer :end_year
      t.string :work_type
      t.timestamps
    end
  end
end
