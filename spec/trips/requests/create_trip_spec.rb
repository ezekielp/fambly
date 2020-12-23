require 'rails_helper'

RSpec.describe 'create_trip mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:departure_point) { Place.create(country: 'England', town: 'Plymouth', name: 'Plymouth Sound') }
  let(:end_point) { Place.create(country: 'England') }
  let(:departure_day) { 27 }
  let(:departure_month) { 12 }
  let(:departure_year) { 1831 }
  let(:end_month) { 9 }
  let(:end_year) { 1835 }
  let(:query_string) do
    "
        mutation CreateTrip($input: CreateTripInput!) {
            createTrip(input: $input) {
                trip {
                    id
                    departurePoint {
                      id
                      country
                      name
                      stateOrRegion
                      town
                      street
                      zipCode
                    }
                    endPoint {
                      id
                      country
                      name
                      stateOrRegion
                      town
                      street
                      zipCode
                    }
                    departureDay
                    departureMonth
                    departureYear
                    endDay
                    endMonth
                    endYear
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
          departure_point_id: departure_point.id,
          end_point_id: end_point.id,
          departure_day: departure_day,
          departure_month: departure_month,
          departure_year: departure_year,
          end_month: end_month,
          end_year: end_year,
        }
    }
  end

  it 'creates a new trip for an associated user' do
    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    trip = JSON.parse(response.body).dig('data', 'createTrip', 'trip')
    expect(trip['departurePoint']).to eq(departure_point)
    expect(trip['endPoint']).to eq(end_point)
    expect(user.trips.first.departure_year).to eq(departure_year)
    expect(user.trips.first.end_year).to eq(end_year)
  end
end
