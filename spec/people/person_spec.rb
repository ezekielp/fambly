require 'rails_helper'

RSpec.describe Person, type: :model do
  after(:each) { travel_back }

  let(:date) { Date.new(2020, 8, 28) }
  let(:valid_month) { 5 }
  let(:invalid_month) { 50 }
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

  describe 'approximate_age_from_birth_year' do
    it 'returns an array with the two possible ages of someone given their birth year' do
      travel_to date

      person.update(birth_year: 2008)
      expect(person.approximate_age_from_birth_year).to eq(12)
    end
  end

  describe 'age_from_full_birthdate' do
    it "returns a person's age given their full birthdate" do
      travel_to date

      expect(person_with_valid_birthdate.age_from_full_birthdate).to eq(83)
    end
  end

  describe 'months_old_from_full_birthdate' do
    it "returns a person's age in months given their full birthdate" do
      travel_to date

      person.update(birth_year: 2018, birth_month: 10, birth_day: 7)
      expect(person.months_old_from_full_birthdate).to eq(22)
    end
  end

  describe 'possible_ages_from_age' do
    it 'returns an approximate age of someone based on their age on a specific date' do
      travel_to date

      person.update(age: 30, date_age_added: Date.new(2015, 6, 12))
      expect(person.approximate_current_age_from_age).to eq(35)
    end
  end

  describe 'approximate_months_old_from_months_old' do
    it 'returns the approximate number of months old a person is based on their months_old on a specific date' do
      travel_to date

      person.update(months_old: 13, date_age_added: Date.new(2019, 11, 11))
      expect(person.approximate_months_old_from_months_old).to eq(22)
    end
  end

  describe 'parent-child associations' do
    it 'correctly associates a person who is a parent to their children via the parent_child joins table' do
      parent = Person.create(user_id: user.id, first_name: 'Miksa', last_name: 'Neumann')
      child = Person.create(user_id: user.id,first_name: 'Janos Lajos', last_name: 'Neumann')
      ParentChild.create(parent_id: parent.id, child_id: child.id)

      parent.reload
      child.reload

      expect(parent.children.first.first_name).to eq('Janos Lajos')
      expect(child.parents.first.first_name).to eq('Miksa')
    end
  end
end
