# == Schema Information
#
# Table name: people
#
#  id             :uuid             not null, primary key
#  age            :integer
#  birth_day      :integer
#  birth_month    :integer
#  birth_year     :integer
#  date_age_added :date
#  first_name     :string           not null
#  last_name      :string
#  months_old     :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :uuid
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
  validates :birth_month, inclusion: { in: 1..12, allow_nil: true }
  validate :birth_year_must_be_in_past

  belongs_to :user
  has_many :notes

  def birth_year_must_be_in_past
    if birth_year.present? && birth_year > Time.zone.now.year
      errors.add(:birth_year, "can't be in the future!")
      self.birth_year = nil
    end
  end

  def age_from_full_birthdate
    return nil unless birth_year && birth_month && birth_day

    now = Time.now.utc.to_date
    approximate_age = now.year - birth_year
    extra_year = now.month > birth_month || (now.month == birth_month && now.day >= birth_day) ? 0 : 1

    approximate_age + extra_year
  end

  def possible_ages_from_birth_year
    return nil unless birth_year

    approximate_age = Time.zone.now.year - birth_year

    [approximate_age - 1, approximate_age]
  end

end