# == Schema Information
#
# Table name: emails
#
#  id         :uuid             not null, primary key
#  email      :string           not null
#  email_type :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid
#
# Indexes
#
#  index_emails_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
require 'rails_helper'

RSpec.describe Email, type: :model do
  let(:user) { create(:user) }
  let(:person) { Person.create(first_name: 'Richard', last_name: 'Feynman', user_id: user.id) }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(Email.create(person_id: person.id, email_address: 'dick.feynman@mit.edu', email_type: 'school')).to be_valid
    end

    it 'validates that the email is a valid email address' do
      invalid_email = Email.new(person_id: person.id, email_address: 'invalid_email_address')
      expect(invalid_email.save).to be false
    end

    it 'validates that the email_type is a valid email type' do
      invalid_email = Email.new(person_id: person.id, email_address: 'great_email@example.com', email_type: 'the_best_email_type')
      expect(invalid_email.save).to be false
    end
  end

end
