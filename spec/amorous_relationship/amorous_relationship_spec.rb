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
  let(:valid_month) { 5 }
  let(:invalid_month) { 50 }
  let(:valid_day) { 8 }
  let(:invalid_day) { 88 }
  let(:valid_year) { 1937 }
  let(:invalid_year) { 2937 }
  let(:end_year) { 1974 }
  let(:end_month) { 4 }
  let(:end_day) { 27 }
  let(:amorous_relationship) { AmorousRelationship.new(partner_one_id: partner_one.id, partner_two_id: partner_two.id) }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      valid_amorous_relationship = AmorousRelationship.create(
        partner_one_id: partner_one.id,
        partner_two_id: partner_two.id,
        relationship_type: valid_relationship_type,
        current: false,
        start_year: valid_year,
        start_month: valid_month,
        start_day: valid_day,
        end_year: end_year,
        end_month: end_month,
        end_day: end_day
      )

      expect(valid_amorous_relationship).to be_valid
    end

    it 'validates that partner_one_id and partner_two_id are valid ids of entries in the people table' do
      invalid_amorous_relationship = AmorousRelationship.new(partner_one_id: 'some_invalid_uuid', partner_two_id: 'another_invalid_uuid')

      expect(invalid_amorous_relationship.save).to be false
    end

    it 'validates that the relationship_type is on the list of valid types' do
      amorous_relationship.relationship_type = invalid_relationship_type
      expect(amorous_relationship.save).to be false
    end

    describe 'start_year' do
      it 'validates that it is earlier or equal to the current year' do
        amorous_relationship.start_year = invalid_year
        expect(amorous_relationship.save).to be false
      end
    end

    describe 'end_year' do
      it 'validates that it is earlier or equal to the current year' do
        amorous_relationship.end_year = invalid_year
        expect(amorous_relationship.save).to be false
      end
    end

    describe 'start_month' do
      it 'validates that it is a month on the Gregorian calendar' do
        amorous_relationship.start_month = invalid_month
        expect(amorous_relationship.save).to be false
      end
    end

    describe 'end_month' do
      it 'validates that it is a month on the Gregorian calendar' do
        amorous_relationship.end_month = invalid_month
        expect(amorous_relationship.save).to be false
      end
    end

    describe 'start_day' do
      it 'validates that it is an integer between 1 and 31, inclusive' do
        amorous_relationship.start_day = invalid_day
        expect(amorous_relationship.save).to be false
      end
    end

    describe 'end_day' do
      it 'validates that it is an integer between 1 and 31, inclusive' do
        amorous_relationship.end_day = invalid_day
        expect(amorous_relationship.save).to be false
      end
    end
  end
end
