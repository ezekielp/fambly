# == Schema Information
#
# Table name: trip_places
#
#  id            :uuid             not null, primary key
#  place_type    :string
#  visit_day     :integer
#  visit_month   :integer
#  visit_year    :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  place_id      :uuid
#  trip_stage_id :uuid
#
# Indexes
#
#  index_trip_places_on_place_id       (place_id)
#  index_trip_places_on_trip_stage_id  (trip_stage_id)
#
# Foreign Keys
#
#  fk_rails_...  (place_id => places.id)
#  fk_rails_...  (trip_stage_id => trip_stages.id)
#
class TripPlace < ApplicationRecord
  validates :visit_day, inclusion: { in: 1..31, allow_nil: true }
  validates :visit_month, inclusion: { in: 1..12, allow_nil: true }

  belongs_to :place
  belongs_to :trip_stage
  has_many :notes, as: :notable, dependent: :destroy
end
