# == Schema Information
#
# Table name: person_places
#
#  id          :uuid             not null, primary key
#  birth_place :boolean          default(FALSE)
#  current     :boolean          default(FALSE)
#  end_month   :integer
#  end_year    :integer
#  start_month :integer
#  start_year  :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :uuid
#  place_id    :uuid
#
# Indexes
#
#  index_person_places_on_person_id  (person_id)
#  index_person_places_on_place_id   (place_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (place_id => places.id)
#
require 'rails_helper'

RSpec.describe PersonPlace, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
