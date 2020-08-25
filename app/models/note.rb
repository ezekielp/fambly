# == Schema Information
#
# Table name: notes
#
#  id         :uuid             not null, primary key
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid
#
# Indexes
#
#  index_notes_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class Note < ApplicationRecord
  belongs_to :person
end
