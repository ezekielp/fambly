require 'rails_helper'

RSpec.describe Person, type: :model do
  let(:valid_month) { 'May' }
  let(:invalid_month) { 'Mayy' }
  let(:valid_day) { 8 }
  let(:invalid_day) { 88 }
  let(:valid_year) { 1937 }
  let(:invalid_year) { 2937 }
  let(:user) { create(:user) }
  let(:person_with_valid_birthdate) { Person.create(user_id: user.id, first_name: 'Thomas', birth_year: valid_year, birth_month: valid_month, birth_day: valid_day) }
  let(:person) { Person.new(first_name: 'Enzian', user_id: user.id) }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(person_with_valid_birthdate).to be_valid
    end

    describe 'birth_year' do
      it 'validates that it is earlier than or equal to the current year' do
        person.birth_year = invalid_year
        expect(person.save).to be false
      end
    end

    describe 'birth_month' do
      it 'validates that it is a month on the Gregorian calendar' do
        person.birth_month = invalid_month
        expect(person.save).to be false
      end
    end

    describe 'birth_day' do
      it 'validates that it is an integer between 1 and 31, inclusive' do
        person.birth_day = invalid_day
        expect(person.save).to be false
      end
    end
  end
end