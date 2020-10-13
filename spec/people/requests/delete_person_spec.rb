require 'rails_helper'

RSpec.describe 'delete_person mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:person) { Person.create(user_id: user.id, first_name: 'Isaac') }
  let(:query_string) do
    "
        mutation DeletePerson($input: DeletePersonInput!) {
            deletePerson(input: $input)
        }
    "
  end

  it 'if the person exists, it deletes the person and returns true' do
    variables = {
      input: {
        personId: person.id
      }
    }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deletePerson')
    expect(mutation_response).to be true
    expect(user.people).to be_empty
  end

  it 'does nothing and returns false if the person does not exist' do
    variables = {
      input: {
        personId: 'non-existent-uuid'
      }
    }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deletePerson')
    expect(mutation_response).to be false
  end
end