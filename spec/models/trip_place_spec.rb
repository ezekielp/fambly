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
require 'rails_helper'

RSpec.describe TripPlace, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
