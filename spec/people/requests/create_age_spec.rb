require 'rails_helper'

RSpec.describe 'create_age mutation' type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:age) { 27 }
  let(:months_old) { 18 }

end