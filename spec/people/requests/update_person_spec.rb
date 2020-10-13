require 'rails_helper'

RSpec.describe 'update_person mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:first_name) { 'Ernest' }
  let(:middle_name) { 'Orlando' }
  let(:last_name) { 'Lawrence' }
  let(:query_string) do
    "
        mutation UpdatePerson($input: UpdatePersonInput!) {
            updatePerson(input: $input) {
                person {
                    id
                    firstName
                    middleName
                    lastName
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end

  it 'updates the attributes of an existing person' do
    expect(person.first_name).not_to eq(first_name)
    expect(person.middle_name).not_to eq(middle_name)
    expect(person.last_name).not_to eq(last_name)

    variables = {
      input: {
        personId: person.id,
        firstName: first_name,
        middleName: middle_name,
        lastName: last_name
      }
    }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person.reload

    updated_person = JSON.parse(response.body).dig('data', 'updatePerson', 'person')
    expect(updated_person['firstName']).to eq(first_name)
    expect(updated_person['middleName']).to eq(middle_name)
    expect(updated_person['lastName']).to eq(last_name)
    expect(person.first_name).to eq(first_name)
    expect(person.middle_name).to eq(middle_name)
    expect(person.last_name).to eq(last_name)
  end

end