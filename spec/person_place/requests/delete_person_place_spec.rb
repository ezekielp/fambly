require 'rails_helper'

RSpec.describe 'delete_person_place mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:person) { create(:person) }
  let(:place) { create(:place) }
  let(:person_place) { PersonPlace.create(person_id: person.id, place_id: place.id) }
  let(:query_string) do
    "
        mutation DeletePersonPlace($input: DeletePersonPlaceInput!) {
            deletePersonPlace(input: $input)
        }
    "
  end

  it 'if the person_place entry exists, it deletes the person_place and returns true' do
    variables =
      {
          input: {
              personPlaceId: person_place.id,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deletePersonPlace')
    expect(mutation_response).to be true
    expect(person.person_places).to be_empty
    expect(place.person_places).to be_empty
  end

  it 'does nothing and returns false if the person_place_id does not exist' do
    variables =
      {
          input: {
              personPlaceId: 'non-existent-uuid',
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deletePersonPlace')
    expect(mutation_response).to be false
  end
end