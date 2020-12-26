require 'rails_helper'

RSpec.describe 'create_trip_person mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:person) { Person.create(user_id: user.id, first_name: 'Captain', last_name: 'Fitzroy') }
  let(:trip) { Trip.create(user_id: user.id) }
  let(:query_string) do
    "
        mutation CreateTripPerson($input: CreateTripPersonInput!) {
            createTripPerson(input: $input) {
                tripPerson {
                    id
                    person {
                      id
                      firstName
                      lastName
                    }
                    trip {
                      id
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
            tripId: trip.id,
            personId: person.id,
        }
    }
  end

  it 'creates a trip_person relationship between a person and a user trip' do
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    trip_person = JSON.parse(response.body).dig('data', 'createTripPerson', 'tripPerson')
    expect(trip_person['person']['firstName']).to eq(person.first_name)
    expect(trip_person['trip']['id']).to eq(trip.id)
    expect(user.trips.first.departure_year).to eq(trip.departure_year)
    expect(trip.people.first.last_name).to eq(person.last_name)
  end
end