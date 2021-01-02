# == Schema Information
#
# Table name: work_positions
#
#  id           :uuid             not null, primary key
#  company_name :string
#  current      :boolean
#  description  :text
#  end_month    :integer
#  end_year     :integer
#  start_month  :integer
#  start_year   :integer
#  title        :string
#  work_type    :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  person_id    :uuid
#  place_id     :uuid
#
# Indexes
#
#  index_work_positions_on_person_id  (person_id)
#  index_work_positions_on_place_id   (place_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (place_id => places.id)
#
require 'rails_helper'

RSpec.describe WorkPosition, type: :model do
  let(:user) { create(:user) }
  let(:person) { Person.create(user_id: user.id, first_name: 'Ken', last_name: 'Thompson') }
  let(:place) { Place.create(country: 'USA', town: 'Holmdel Township', state_or_region: 'NJ') }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(WorkPosition.create(person_id: person.id, place_id: place.id, title: 'Designer of Unix', company_name: 'Bell Labs', current: false, work_type: 'full_time', start_year: 1966, end_year: 2000)).to be_valid
    end
  end
end

