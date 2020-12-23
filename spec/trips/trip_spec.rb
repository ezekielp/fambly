# == Schema Information
#
# Table name: trips
#
#  id                 :uuid             not null, primary key
#  departure_day      :integer
#  departure_month    :integer
#  departure_year     :integer
#  end_day            :integer
#  end_month          :integer
#  end_year           :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  departure_point_id :uuid
#  end_point_id       :uuid
#  user_id            :uuid
#
# Indexes
#
#  index_trips_on_departure_point_id  (departure_point_id)
#  index_trips_on_end_point_id        (end_point_id)
#  index_trips_on_user_id             (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (departure_point_id => places.id)
#  fk_rails_...  (end_point_id => places.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Trip, type: :model do
  let(:user) { create(:user) }
  let(:departure_point) { Place.create(country: 'USA', town: 'New York') }
  let(:end_point) { Place.create(country: 'Germany', town: 'Berlin') }
  let(:departure_day) { 2 }
  let(:departure_month) { 4 }
  let(:departure_year) { 1921 }
  let(:end_month) { 7 }
  let(:end_year) { 1921 }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(Trip.create(
        user_id: user.id,
        departure_point_id: departure_point.id,
        end_point_id: end_point.id,
        departure_day: departure_day,
        departure_month: departure_month,
        departure_year: departure_year,
        end_month: end_month,
        end_year: end_year
        )
      ).to be_valid
      expect(Trip.create(
        user_id: user.id,
        departure_day: departure_day,
        departure_month: departure_month,
        departure_year: departure_year,
        end_month: end_month,
        end_year: end_year
        )
      ).to be_valid
    end
  end
end
