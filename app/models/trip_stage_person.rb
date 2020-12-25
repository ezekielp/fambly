# == Schema Information
#
# Table name: trip_stage_people
#
#  id            :uuid             not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  person_id     :uuid
#  trip_stage_id :uuid
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (trip_stage_id => trip_stages.id)
#
class TripStagePerson < ApplicationRecord
  belongs_to :person
  belongs_to :trip_stage
  has_many :notes, as: :notable, dependent: :destroy
end
