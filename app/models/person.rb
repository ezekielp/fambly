# == Schema Information
#
# Table name: people
#
#  id                :uuid             not null, primary key
#  age               :integer
#  birth_day         :integer
#  birth_month       :integer
#  birth_year        :integer
#  date_age_added    :date
#  first_name        :string           not null
#  gender            :string
#  last_name         :string
#  middle_name       :string
#  months_old        :integer
#  show_on_dashboard :boolean          default(TRUE)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :uuid
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
  has_many :notes, as: :notable, dependent: :destroy
  has_many :parent_child_relationships, class_name: 'ParentChild', foreign_key: 'parent_id', dependent: :destroy
  has_many :child_parent_relationships, class_name: 'ParentChild', foreign_key: 'child_id', dependent: :destroy
  has_many :parents, through: :child_parent_relationships
  has_many :children, through: :parent_child_relationships
  has_many :sibling_one_relationships, class_name: 'SiblingRelationship', foreign_key: 'sibling_one_id', dependent: :destroy
  has_many :sibling_two_relationships, class_name: 'SiblingRelationship', foreign_key: 'sibling_two_id', dependent: :destroy
  has_many :sibling_ones, through: :sibling_two_relationships
  has_many :sibling_twos, through: :sibling_one_relationships
  has_many :person_places, dependent: :destroy
  has_many :places, through: :person_places
  has_many :person_tags, dependent: :destroy
  has_many :tags, through: :person_tags

  def siblings
    # NOTE: This returns an array, not an Active Record Relation
    # So might want to refactor. But typical '.merge' was not working
    sibling_ones + sibling_twos
  end

  def birth_year_must_be_in_past
    if birth_year.present? && birth_year > Time.zone.now.year
      errors.add(:birth_year, "can't be in the future!")
      self.birth_year = nil
    end
  end

  def age_from_full_birthdate
    return nil unless birth_year && birth_month && birth_day

    now.year - birth_year - 1 + extra_year_for_ages(birth_month, birth_day)
  end

  def months_old_from_full_birthdate
    return nil unless birth_year && birth_month && birth_day

    months = (now.month - birth_month) + (12 * (now.year - birth_year))
    extra_month = now.day >= birth_day ? 0 : 1
    months + extra_month
  end

  def approximate_age_from_birth_year
    return nil unless birth_year
    Time.zone.now.year - birth_year
  end

  def approximate_current_age_from_age
    return nil unless age && date_age_added
    age + now.year - date_age_added.year
  end

  def approximate_months_old_from_months_old
    return nil unless months_old && date_age_added
    months_old + (now.month - date_age_added.month) + (12 * (now.year - date_age_added.year))
  end

  private

  def now
    Time.now.utc.to_date
  end

  def extra_year_for_ages(month, day)
    if now.month > month || (now.month == month && now.day >= day)
      return 1
    end
    0
  end

end
