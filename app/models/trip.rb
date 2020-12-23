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
class Trip < ApplicationRecord
  belongs_to :user
  belongs_to :departure_point, class_name: 'Place', foreign_key: 'departure_point_id'
  belongs_to :end_point, class_name: 'Place', foreign_key: 'end_point_id'
  has_many :trip_stages
  has_many :person_trips
  has_many :people, through: :person_trips
end
