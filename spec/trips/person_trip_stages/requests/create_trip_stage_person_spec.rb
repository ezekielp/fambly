require 'rails_helper'

RSpec.describe 'create_trip_stage_person mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:person) { Person.create(user_id: user.id, first_name: 'Captain', last_name: 'Fitzroy') }
  let(:trip) { Trip.create(user_id: user.id, name: 'HMS Beagle voyage') }
  let(:place) { create(:place) }
  let(:trip_stage) { TripStage.create(trip_id: trip.id, place_id: place.id) }
  let(:query_string) do
    "
        mutation CreateTripStagePerson($input: CreateTripStagePersonInput!) {
            createTripStagePerson(input: $input) {
                tripStagePerson {
                    id
                    person {
                      id
                      firstName
                      lastName
                    }
                    tripStage {
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
            tripStageId: trip_stage.id,
            personId: person.id,
        }
    }
  end

  it 'creates a trip_stage_person relationship between a trip_stage and a person' do
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    trip_stage_person = JSON.parse(response.body).dig('data', 'createTripStagePerson', 'tripStagePerson')
    # debugger
    expect(trip_stage_person['person']['firstName']).to eq(person.first_name)
    expect(trip_stage_person['tripStage']['id']).to eq(trip_stage.id)
    expect(person.trip_stages.first.id).to eq(trip_stage.id)
    expect(trip_stage.people.first.last_name).to eq(person.last_name)
  end
end