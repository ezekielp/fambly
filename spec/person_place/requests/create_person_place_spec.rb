require 'rails_helper'

RSpec.describe 'create_person_place mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:person) { Person.create(user_id: user.id, first_name: 'Leonhard', last_name: 'Euler') }
  let(:query_string) do
    "
        mutation CreatePersonPlace($input: CreatePersonPlaceInput!) {
            createPersonPlace(input: $input) {
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
                    placeType
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
  let(:variables) do
    {
        input: {
          personId: person.id,
          country: 'Switzerland',
          town: 'Basel',
          placeType: 'birth_place',
          startMonth: 4,
          startYear: 1707
        }
    }
  end

  it 'finds or creates a place and a person_place between that place and the associated person' do
    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person_place = JSON.parse(response.body).dig('data', 'createPersonPlace', 'personPlace')
    expect(person_place['person']['firstName']).to eq(person.first_name)
    expect(person_place['place']['town']).to eq('Basel')
    expect(person.places.first.country).to eq('Switzerland')
  end

  it 'does not create a new place if one already exists with the given parameters' do
    place = Place.create(country: 'Switzerland', town: 'Basel')

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person_place = JSON.parse(response.body).dig('data', 'createPersonPlace', 'personPlace')
    expect(person.places.first.id).to eq(place.id)
  end
end