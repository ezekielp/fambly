# == Schema Information
#
# Table name: parent_children
#
#  id          :uuid             not null, primary key
#  note        :text
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  child_id    :uuid
#  parent_id   :uuid
#
# Indexes
#
#  index_parent_children_on_child_id   (child_id)
#  index_parent_children_on_parent_id  (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (child_id => people.id)
#  fk_rails_...  (parent_id => people.id)
#
class ParentChild < ApplicationRecord
  validates :parent_type, inclusion: { in: %w[step_parent in_law biological], allow_nil: true }

  belongs_to :parent, class_name: 'Person', foreign_key: 'parent_id'
  belongs_to :child, class_name: 'Person', foreign_key: 'child_id'

end
