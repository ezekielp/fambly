# == Schema Information
#
# Table name: places
#
#  id              :uuid             not null, primary key
#  country         :string           not null
#  state_or_region :string
#  street          :string
#  town            :string
#  zip_code        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class Place < ApplicationRecord
  has_many :person_places
end
