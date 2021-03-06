# == Schema Information
#
# Table name: trip_people
#
#  id         :uuid             not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid
#  trip_id    :uuid
#
# Indexes
#
#  index_trip_people_on_person_id  (person_id)
#  index_trip_people_on_trip_id    (trip_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (trip_id => trips.id)
#
class TripPerson < ApplicationRecord
  belongs_to :person
  belongs_to :trip
  has_many :notes, as: :notable, dependent: :destroy
end
