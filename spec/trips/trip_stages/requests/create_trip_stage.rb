require 'rails_helper'

RSpec.describe 'create_trip_stage mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:trip) { create(:trip) }
  let(:place_name) { 'Galapagos Islands' }
  let(:accommodation_name) { 'HMS Beagle' }
  let(:start_day) { 15 }
  let(:start_month) { 9 }
  let(:start_year) { 1835 }
  let(:start_day) { 19 }
  let(:start_month) { 10 }
  let(:start_year) { 1835 }
  let(:note) { '... very remarkable: it seems to be a little world within itself; the greater number of its inhabitants, both vegetable and animal, being found nowhere else.' }
  let(:query_string) do
    "
        mutation CreateTripStage($input: CreateTripStageInput!) {
            createTripStage(input: $input) {
                tripStage {
                    id
                    trip {
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
                    accommodation {
                      id
                      name
                      country
                      stateOrRegion
                      town
                      street
                      zipCode
                    }
                    startDay
                    startMonth
                    startYear
                    endDay
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
          tripId: trip.id,
          placeName: place_name,
          accommodationName: accommodation_name,
          startDay: start_day,
          startMonth: start_month,
          startYear: start_year,
          endDay: end_day,
          endMonth: end_month,
          endYear: end_year,
          note: note
        }
    }
  end

  it 'creates a new trip_stage for an existing trip' do
    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    trip_stage = JSON.parse(response.body).dig('data', 'createTripStage', 'tripStage')
    expect(trip_stage['place']['name']).to eq(place_name)
    expect(trip_stage['accommodation']['name']).to eq(accommodation_name)
    expect(trip.trip_stages.first.start_year).to eq(start_year)
    expect(trip.trip_stages.first.end_month).to eq(end_month)
  end
end

