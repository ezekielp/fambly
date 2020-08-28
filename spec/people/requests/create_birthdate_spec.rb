require 'rails_helper'

RSpec.describe 'create_birthdate mutation' type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:birth_year) { 2005 }
  let(:birth_month) { 'November' }
  let(:birth_day) { 27 }

end