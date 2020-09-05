require 'rails_helper'

RSpec.describe 'delete_age mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person_with_age) { create(:person, :with_age) }
  let(:query_string) do
    "
        mutation DeleteAge($input: DeleteAgeInput!) {
            deleteAge(input: $input)
        }
    "
  end

  it 'deletes the age column from a person and returns true if the person no longer has an age column of data associated with them' do
    variables =
      {
          input: {
              personId: person_with_age.id,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person_with_age.reload

    mutation_response = JSON.parse(response.body).dig('data', 'deleteAge')
    expect(mutation_response).to be true 
    expect(person_with_age.age).to be_nil   
  end

  it 'does nothing and returns false if the person_id does not exist' do
    variables =
      {
          input: {
              personId: 'non-existent-person-id',
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteAge')
    expect(mutation_response).to be false
  end
end

