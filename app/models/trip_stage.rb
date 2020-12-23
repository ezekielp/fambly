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
end
