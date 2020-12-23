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
  let(:trip_stage) { create(:trip_stage) }
  let(:visited_place) { Place.create(country: 'Vanuatu', street: '111 Taro Root Drive') }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(TripPlace.create(
        trip_stage_id: trip_stage.id,
        place_id: visited_place.id,
        visit_day: 1,
        visit_month: 1,
        visit_year: 1111,
        place_type: 'restaurant'
        )
      )
    end
  end
end
