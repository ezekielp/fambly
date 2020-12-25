require 'rails_helper'

RSpec.describe 'create trip_stage_person mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:person) { Person.create(user_id: user.id, first_name: 'Captain', last_name: 'Fitzroy') }
  let(:trip) { Trip.create(user_id: user.id) }
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
            tripStageId: trip.id,
            personId: person.id,
        }
    }
  end



end