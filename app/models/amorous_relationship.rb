# == Schema Information
#
# Table name: amorous_relationships
#
#  id                :uuid             not null, primary key
#  current           :boolean          default(TRUE)
#  end_day           :integer
#  end_month         :integer
#  end_year          :integer
#  relationship_type :string
#  start_day         :integer
#  start_month       :integer
#  start_year        :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  partner_one_id    :uuid
#  partner_two_id    :uuid
#
# Indexes
#
#  index_amorous_relationships_on_partner_one_id  (partner_one_id)
#  index_amorous_relationships_on_partner_two_id  (partner_two_id)
#
# Foreign Keys
#
#  fk_rails_...  (partner_one_id => people.id)
#  fk_rails_...  (partner_two_id => people.id)
#
class AmorousRelationship < ApplicationRecord
  validates :relationship_type, inclusion: { in: %w[marriage dating sexual], allow_nil: true }
  validates :start_month, :end_month, inclusion: { in: 1..12, allow_nil: true }
  validates :start_day, :end_day, inclusion: { in: 1..31, allow_nil: true }
  validate :start_year_must_be_in_past
  validate :end_year_must_be_in_past

  belongs_to :partner_one, class_name: 'Person', foreign_key: 'partner_one_id'
  belongs_to :partner_two, class_name: 'Person', foreign_key: 'partner_two_id'
  has_many :notes, as: :notable

  def start_year_must_be_in_past
    if start_year.present? && start_year > Time.zone.now.year
      errors.add(:start_year, "can't be in the future!")
      self.start_year = nil
    end
  end

  def end_year_must_be_in_past
    if end_year.present? && end_year > Time.zone.now.year
      errors.add(:end_year, "can't be in the future!")
      self.end_year = nil
    end
  end
end
