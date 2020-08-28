require 'rails_helper'

RSpec.describe 'create_birthdate mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:birth_year) { 1937 }
  let(:birth_month) { 'May' }
  let(:birth_day) { 8 }
  let(:invalid_birth_year) { 2937 }
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

  it 'adds birthdate information to a person when the data is valid' do
    variables = 
      {
        input: {
            personId: person.id,
            birthYear: birth_year,
            birthMonth: birth_month,
            birthDay: birth_day
        }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person.reload

    returned_person = JSON.parse(response.body).dig('data', 'createBirthdate', 'person')
    expect(returned_person['birthYear']).to eq(birth_year)
    expect(returned_person['birthMonth']).to eq(birth_month)
    expect(returned_person['birthDay']).to eq(birth_day)
    expect(person.birth_year).to eq(birth_year)
    expect(person.birth_month).to eq(birth_month)
    expect(person.birth_day).to eq(birth_day)
  end

  it 'returns an error when an invalid birth year is passed as a variable' do
    variables = 
      {
        input: {
            personId: person.id,
            birthYear: invalid_birth_year,
        }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person.reload

    mutation_response = JSON.parse(response.body).dig('data', 'createBirthdate')
    expect(mutation_response['errors']).not_to be_nil
    expect(mutation_response['person']).to be_nil
  end

end