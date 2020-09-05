require 'rails_helper'

RSpec.describe 'delete_gender mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person, :with_gender) }
  let(:query_string) do
    "
        mutation DeleteGender($input: DeleteGenderInput!) {
            deleteGender(input: $input)
        }
    "
  end

  it 'deletes the gender from an existing person and returns true if gender is now nil' do
    variables =
      {
          input: {
              personId: person.id,
          }
      }
      
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    person.reload

    mutation_response = JSON.parse(response.body).dig('data', 'deleteGender')
    expect(mutation_response).to be true
    expect(person.gender).to be_nil
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

    mutation_response = JSON.parse(response.body).dig('data', 'deleteGender')
    expect(mutation_response).to be false
  end
end
