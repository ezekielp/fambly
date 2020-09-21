# == Schema Information
#
# Table name: tags
#
#  id         :uuid             not null, primary key
#  color      :string
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid
#
# Indexes
#
#  index_tags_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Tag, type: :model do
  let(:user) { create(:user) }
  let(:valid_color) { '#02a4d3' }
  let(:invalid_color) { '#QWERTY' }
  let(:name) { 'gophers' }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(Tag.create(color: valid_color, name: name, user_id: user.id)).to be_valid
    end

    describe 'name' do
      it 'validates its presence' do
        expect(Tag.create(color: valid_color, user_id: user.id)).not_to be_valid
      end

      it 'validates its uniqueness' do
        Tag.create(color: valid_color, name: name, user_id: user.id)
        expect(Tag.create(color: valid_color, name: name, user_id: user.id)).not_to be_valid
      end
    end

    describe 'color' do
      it 'validates that the color is a valid hex color code' do
        expect(Tag.create(color: invalid_color, name: name, user_id: user.id)).not_to be_valid
      end
    end
  end
end
