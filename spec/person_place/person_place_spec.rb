# == Schema Information
#
# Table name: person_places
#
#  id          :uuid             not null, primary key
#  birth_place :boolean          default(FALSE)
#  current     :boolean          default(FALSE)
#  end_month   :integer
#  end_year    :integer
#  start_month :integer
#  start_year  :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :uuid
#  place_id    :uuid
#
# Indexes
#
#  index_person_places_on_person_id  (person_id)
#  index_person_places_on_place_id   (place_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (place_id => places.id)
#
require 'rails_helper'

RSpec.describe PersonPlace, type: :model do
  let(:user) { create(:user) }
  let(:person) { Person.create(user_id: user.id, first_name: 'Leonhard', last_name: 'Euler') }
  let(:place) { Place.create(country: 'Switzerland', town: 'Basel') }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(PersonPlace.create(person_id: person.id, place_id: place.id, birth_place: true)).to be_valid
    end

    it 'validates that the place_id and person_id are valid ids of entries in the places and people tables' do
      invalid_person_place = PersonPlace.new(place_id: 'invalid_uuid', person_id: 'another_invalid_uuid')
      expect(invalid_person_place.save).to be false
    end
  end

end
