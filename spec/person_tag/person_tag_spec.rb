# == Schema Information
#
# Table name: person_tags
#
#  id         :uuid             not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid
#  tag_id     :uuid
#
# Indexes
#
#  index_person_tags_on_person_id  (person_id)
#  index_person_tags_on_tag_id     (tag_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (tag_id => tags.id)
#
require 'rails_helper'

RSpec.describe PersonTag, type: :model do
  let(:user) { create(:user) }
  let(:person) { create(:person) }
  let(:tag) { create(:tag) }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      expect(PersonTag.create(person_id: person.id, tag_id: tag.id)).to be_valid
    end

    it 'validates that the person_id and tag_id are valid ids of entries in the people and tags tables' do
      invalid_person_tag = PersonTag.new(person_id: 'invalid_person_tag', tag_id: 'invalid_tag_id')
      expect(invalid_person_tag.save).to be false
    end
  end
end
