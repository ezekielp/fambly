# == Schema Information
#
# Table name: work_positions
#
#  id           :uuid             not null, primary key
#  company_name :string
#  current      :boolean
#  description  :text
#  end_month    :integer
#  end_year     :integer
#  start_month  :integer
#  start_year   :integer
#  title        :string
#  work_type    :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  person_id    :uuid
#  place_id     :uuid
#
# Indexes
#
#  index_work_positions_on_person_id  (person_id)
#  index_work_positions_on_place_id   (place_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (place_id => places.id)
#
class WorkPosition < ApplicationRecord
end
