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
class PersonTag < ApplicationRecord
  belongs_to :person
  belongs_to :tag
end
