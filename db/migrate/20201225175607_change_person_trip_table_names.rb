class ChangePersonTripTableNames < ActiveRecord::Migration[6.0]
  def change
    rename_table :person_trips, :trip_people
    rename_table :person_trip_stages, :trip_stage_people
  end
end
