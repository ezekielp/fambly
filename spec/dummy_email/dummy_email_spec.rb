# == Schema Information
#
# Table name: dummy_emails
#
#  id         :uuid             not null, primary key
#  email      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid
#
# Indexes
#
#  index_dummy_emails_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe DummyEmail, type: :model do
  let(:user) { create(:user) }
  let(:email) { 'some-uuid@fakeemail.com' }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(DummyEmail.create(email: email, user_id: user.id)).to be_valid
    end
  end

end
