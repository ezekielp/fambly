require 'rails_helper'

RSpec.describe 'update_person_place mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:person) { create(:person) }
  let(:place) { create(:place) }
  let(:person_place) { PersonPlace.create(person_id: person.id, place_id: place.id) }
  let(:new_street) { '47 Teddy Bloat Dr' }
  let(:new_end_year) { 2077 }
  let(:query_string) do
    "
        mutation UpdatePersonPlace($input: UpdatePersonPlaceInput!) {
            updatePersonPlace(input: $input) {
                personPlace {
                    id
                    person {
                      id
                      firstName
                    }
                    place {
                      id
                      country
                      stateOrRegion
                      town
                      street
                      zipCode
                    }
                    birthPlace
                    current
                    startMonth
                    startYear
                    endMonth
                    endYear
                    notes {
                      id
                      content
                    }
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end

  it 'updates an existing person_place and returns it when the person_place exists' do
    variables =
      {
          input: {
              personPlaceId: person_place.id,
              street: new_street,
              endYear: new_end_year,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    updated_person_place = JSON.parse(response.body).dig('data', 'updatePersonPlace', 'personPlace')
    expect(updated_person_place['place']['street']).to eq(street)
    expect(updated_person_place['endYear']).to eq(new_end_year)
    expect(person.places.first.street).to eq(new_street)
    expect(person.person_places.first.end_year).to eq(new_end_year)
  end


end