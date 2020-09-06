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
require 'rails_helper'

RSpec.describe Place, type: :model do
  let(:country) { 'USA' }
  let(:state_or_region) { 'NY' }
  let(:town) { 'Glen Cove' }
  let(:street) { 'High Pine Rd' }
  let(:zip_code) { '11542' }

  describe 'ActiveModel validations' do
    it 'is valid with valid attributes' do
      place = Place.create(country: country, state_or_region: state_or_region, town: town, street: street, zip_code: zip_code)
      
      expect(place).to be_valid
    end
  end

end
