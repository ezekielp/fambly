# == Schema Information
#
# Table name: trip_stages
#
#  id               :uuid             not null, primary key
#  end_day          :integer
#  end_month        :integer
#  end_year         :integer
#  start_day        :integer
#  start_month      :integer
#  start_year       :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  accommodation_id :uuid
#  place_id         :uuid
#  trip_id          :uuid
#
# Indexes
#
#  index_trip_stages_on_accommodation_id  (accommodation_id)
#  index_trip_stages_on_place_id          (place_id)
#  index_trip_stages_on_trip_id           (trip_id)
#
# Foreign Keys
#
#  fk_rails_...  (accommodation_id => places.id)
#  fk_rails_...  (place_id => places.id)
#  fk_rails_...  (trip_id => trips.id)
#
class TripStage < ApplicationRecord
  validates :start_day, :end_day, inclusion: { in: 1..31, allow_nil: true }
  validates :start_month, :end_month, inclusion: { in: 1..12, allow_nil: true }

  belongs_to :trip
  belongs_to :place
  belongs_to :accommodation, class_name: 'Place', foreign_key: 'accommodation_id', optional: true
  has_many :person_trip_stages
  has_many :people, through: :person_trip_stages
  has_many :trip_places
  has_many :notes, as: :notable, dependent: :destroy
end
