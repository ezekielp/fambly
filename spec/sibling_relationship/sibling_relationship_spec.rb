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
require 'rails_helper'

RSpec.describe SiblingRelationship, type: :model do
  let(:valid_sibling_type) { 'biological' }
  let(:invalid_sibling_type) { 'tautological' }
  let(:user) { create(:user) }
  let(:sibling_one) { Person.create(user_id: user.id, first_name: 'Johann', last_name: 'Bernoulli') }
  let(:sibling_two) { Person.create(user_id: user.id,first_name: 'Jacob', last_name: 'Bernoulli') }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      sibling_relationship = SiblingRelationship.create(sibling_one_id: sibling_one.id, sibling_two_id: sibling_two.id, sibling_type: valid_sibling_type)

      expect(sibling_relationship).to be_valid
    end

    it 'validates that the sibling_one_id and sibling_two_id are valid ids of entries in the people table' do
      sibling_relationship = SiblingRelationship.new(sibling_one_id: 'some_invalid_uuid', sibling_two_id: 'another_invalid_uuid')

      expect(sibling_relationship.save).to be false
    end

    it 'validates that the sibling_type is on the list of valid types' do
      sibling_relationship = SiblingRelationship.create(sibling_one_id: sibling_one.id, sibling_two_id: sibling_two.id, sibling_type: invalid_sibling_type)

      expect(sibling_relationship).not_to be_valid
    end
  end

end
