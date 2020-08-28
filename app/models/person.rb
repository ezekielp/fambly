# == Schema Information
#
# Table name: people
#
#  id          :uuid             not null, primary key
#  age         :integer
#  birth_day   :integer
#  birth_month :string
#  birth_year  :integer
#  first_name  :string           not null
#  last_name   :string
#  months_old  :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :uuid
#
# Indexes
#
#  index_people_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Person < ApplicationRecord
  validates :birth_day, inclusion: { in: 1..31, allow_nil: true }
  validates :birth_month, inclusion: { in: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], allow_nil: true }
  validate :birth_year_must_be_in_past

  belongs_to :user
  has_many :notes

  def birth_year_must_be_in_past
    if birth_year.present? && birth_year > Date.today.year
      errors.add(:birth_year, "can't be in the future!")
    end
  end
end
