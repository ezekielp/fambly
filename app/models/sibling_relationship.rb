# == Schema Information
#
# Table name: sibling_relationships
#
#  id             :uuid             not null, primary key
#  sibling_type   :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  sibling_one_id :uuid
#  sibling_two_id :uuid
#
# Indexes
#
#  index_sibling_relationships_on_sibling_one_id  (sibling_one_id)
#  index_sibling_relationships_on_sibling_two_id  (sibling_two_id)
#
# Foreign Keys
#
#  fk_rails_...  (sibling_one_id => people.id)
#  fk_rails_...  (sibling_two_id => people.id)
#
class SiblingRelationship < ApplicationRecord
  validates :sibling_type, inclusion: { in: %w[step_sibling in_law biological], allow_nil: true }

  belongs_to :sibling_one, class_name: 'Person', foreign_key: 'sibling_one_id'
  belongs_to :sibling_two, class_name: 'Person', foreign_key: 'sibling_two_id'
  has_many :notes, as: :notable
end
