# == Schema Information
#
# Table name: person_trips
#
#  id         :uuid             not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid
#  trip_id    :uuid
#
# Indexes
#
#  index_person_trips_on_person_id  (person_id)
#  index_person_trips_on_trip_id    (trip_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (trip_id => trips.id)
#
class PersonTrip < ApplicationRecord
end
