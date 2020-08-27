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
require 'rails_helper'

RSpec.describe Note, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
