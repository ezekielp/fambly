require 'rails_helper'

RSpec.describe 'create_birthdate mutation' type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:birth_year) { 1937 }
  let(:birth_month) { 'May' }
  let(:birth_day) { 8 }
  let(:query_string) do
    "
        mutation CreateBirthdate($input: CreateBirthdateInput!) {
            createBirthdate(input: $input) {
                person {
                    id
                    birthYear
                    birthMonth
                    birthDay
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end

end