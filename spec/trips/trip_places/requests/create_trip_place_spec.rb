require 'rails_helper'

RSpec.describe 'create_trip_place mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:trip_stage) { create(:trip_stage) }
  let(:place_name) { 'Isla Santiago' }
  let(:country) { 'Ecuador' }
  let(:region) { 'Galapagos Islands' }
  let(:visit_day) { 8 }
  let(:visit_month) { 10 }
  let(:visit_year) { 1835 }
  let(:place_type) { 'place_in_nature' }
  let(:note) { 'The archipelago is a little world within itself, or rather a satellite attached to America, whence it has derived a few stray colonists, and has received the general character of its indigenous productions.' }
  let(:query_string) do
    "
        mutation CreateTripPlace($input: CreateTripPlaceInput!) {
            createTripPlace(input: $input) {
                tripPlace {
                    id
                    tripStage {
                      id
                    }
                    place {
                      id
                      name
                      country
                      stateOrRegion
                      town
                      street
                      zipCode
                    }
                    visitDay
                    visitMonth
                    visitYear
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
          tripStageId: trip_stage.id,
          placeName: place_name,
          placeCountry: country,
          placeStateOrRegion: region,
          visitDay: visit_day,
          visitMonth: visit_month,
          visitYear: visit_year,
          placeType: place_type,
          note: note
        }
    }
  end

  it 'creates a new trip_place for an existing trip_stage' do
    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    trip_place = JSON.parse(response.body).dig('data', 'createTripPlace', 'tripPlace')
    expect(trip_place['place']['name']).to eq(place_name)
    expect(trip_place['visitMonth']).to eq(visit_month)
    expect(trip_stage.trip_places.first.visit_day).to eq(visit_day)
    expect(trip_stage.trip_places.first.place_type).to eq(place_type)
  end
end