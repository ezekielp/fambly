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
class Tag < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :color, format: { with: /\A#([0-9A-Fa-f]{3}){1,2}\z/, message: "Invalid hex color!" }, allow_nil: true

  has_many :person_tags, dependent: :destroy
  has_many :people, through: :person_tags
  belongs_to :user
end
