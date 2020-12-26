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
  validates :departure_day, :end_day, inclusion: { in: 1..31, allow_nil: true }
  validates :departure_month, :end_month, inclusion: { in: 1..12, allow_nil: true }

  belongs_to :user
  belongs_to :departure_point, class_name: 'Place', foreign_key: 'departure_point_id', optional: true
  belongs_to :end_point, class_name: 'Place', foreign_key: 'end_point_id', optional: true
  has_many :trip_stages
  has_many :trip_people
  has_many :people, through: :trip_people
  has_many :notes, as: :notable, dependent: :destroy
end
