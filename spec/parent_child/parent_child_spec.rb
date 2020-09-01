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
require 'rails_helper'

RSpec.describe ParentChild, type: :model do
  let(:valid_parent_type) { 'step_parent' }
  let(:invalid_parent_type) { 'bad_parent' }
  let(:user) { create(:user) }
  let(:parent) { Person.create(user_id: user.id, first_name: 'Miksa', last_name: 'Neumann') }
  let(:child) { Person.create(user_id: user.id,first_name: 'Janos Lajos', last_name: 'Neumann') }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      parent_child = ParentChild.create(parent_id: parent.id, child_id: child.id, parent_type: valid_parent_type)

      expect(parent_child).to be_valid
    end

    it 'validates that the parent_id and child_id are valid ids of entries in the people table' do
      invalid_parent_child = ParentChild.new(parent_id: 'some_uuid', child_id: 'another_invalid_uuid')
      expect(invalid_parent_child.save).to be false
    end

    it 'validates that the parent_type is in the list of valid types' do
      parent_child = ParentChild.create(parent_id: parent.id, child_id: child.id, parent_type: invalid_parent_type)
      expect(parent_child).not_to be_valid
    end
  end

end
