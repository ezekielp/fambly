# == Schema Information
#
# Table name: people
#
#  id         :uuid             not null, primary key
#  first_name :string           not null
#  last_name  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid
#
# Indexes
#
#  index_people_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Person < ApplicationRecord
  belongs_to :user
  has_many :notes
end
