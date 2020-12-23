# == Schema Information
#
# Table name: person_trip_stages
#
#  id            :uuid             not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  person_id     :uuid
#  trip_stage_id :uuid
#
# Indexes
#
#  index_person_trip_stages_on_person_id      (person_id)
#  index_person_trip_stages_on_trip_stage_id  (trip_stage_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (trip_stage_id => trip_stages.id)
#
class PersonTripStage < ApplicationRecord
end
