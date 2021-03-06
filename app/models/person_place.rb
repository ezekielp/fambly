# == Schema Information
#
# Table name: person_places
#
#  id          :uuid             not null, primary key
#  current     :boolean          default(FALSE)
#  end_month   :integer
#  end_year    :integer
#  place_type  :string
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
class PersonPlace < ApplicationRecord
  validates :place_type, inclusion: { in: %w[home work vacation birth_place], allow_nil: true }
  validates :start_month, :end_month, inclusion: { in: 1..12, allow_nil: true }

  belongs_to :place
  belongs_to :person
  has_many :notes, as: :notable, dependent: :destroy
end
