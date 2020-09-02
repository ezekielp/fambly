class AddShowOnDashboardToPeople < ActiveRecord::Migration[6.0]
  def change
    add_column :people, :show_on_dashboard, :boolean, default: true
  end
end
