# == Schema Information
#
# Table name: tags
#
#  id         :uuid             not null, primary key
#  color      :string
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Tag < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :color, format: { with: /\A#([0-9A-Fa-f]{3}){1,2}\z/, message: "Invalid hex color!" }

  has_many :person_tags
  has_many :people, through: :person_tags
end
