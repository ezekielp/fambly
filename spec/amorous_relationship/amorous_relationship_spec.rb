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
require 'rails_helper'

RSpec.describe AmorousRelationship, type: :model do
  let(:valid_relationship_type) { 'marriage' }
  let(:invalid_relationship_type) { 'handholders' }
  let(:user) { create(:user) }
  let(:partner_one) { Person.create(user_id: user.id, first_name: 'Marie', last_name: 'Curie') }
  let(:partner_two) { Person.create(user_id: user.id, first_name: 'Pierre', last_name: 'Curie') }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      amorous_relationship = AmorousRelationship.create(partner_one_id: partner_one.id, partner_two_id: partner_two.id, relationship_type: valid_relationship_type)

      expect(amorous_relationship).to be_valid
    end

    it 'validates that partner_one_id and partner_two_id are valid ids of entries in the people table' do
      amorous_relationship = AmorousRelationship.new(partner_one_id: 'some_invalid_uuid', partner_two_id: 'another_invalid_uuid')

      expect(amorous_relationship.save).to be false
    end

    it 'validates that the relationship_type is on the list of valid types' do
      amorous_relationship = AmorousRelationship.create(partner_one_id: partner_one.id, partner_two_id: partner_two.id, relationship_type: invalid_relationship_type)

      expect(amorous_relationship).not_to be_valid
    end
  end
end
