# == Schema Information
#
# Table name: places
#
#  id              :uuid             not null, primary key
#  country         :string           not null
#  state_or_region :string
#  street          :string
#  town            :string
#  zip_code        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class Place < ApplicationRecord
  has_many :person_places
  has_many :trips_as_departure_point, class_name: 'Trip', foreign_key: 'departure_point_id', dependent: :destroy
  has_many :trips_as_end_point, class_name: 'Trip', foreign_key: 'end_point_id', dependent: :destroy
  has_many :trip_stages
  has_many :trip_stages_as_accommodation, class_name: 'TripStage', foreign_key: 'accommodation_id', dependent: :destroy
  has_many :trip_places
end
