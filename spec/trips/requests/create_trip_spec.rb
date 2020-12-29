require 'rails_helper'

RSpec.describe 'create_trip mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:name) { 'HMS Beagle voyage' }
  let(:password) { 'Schwarzgerat' }
  let(:country) { 'England' }
  let(:town) { 'Plymouth' }
  let(:departure_day) { 27 }
  let(:departure_month) { 12 }
  let(:departure_year) { 1831 }
  let(:end_month) { 10 }
  let(:end_year) { 1836 }
  let(:note) { 'Considering the small size of these islands, we feel the more astonished at the number of their aboriginal beings, and at their confined range... within a period geologically recent the unbroken ocean was here spread out. Hence, both in space and time, we seem to be brought somewhat near to that great fact – that mystery of mysteries – the first appearance of new beings on this earth.' }
  let(:query_string) do
    "
        mutation CreateTrip($input: CreateTripInput!) {
            createTrip(input: $input) {
                trip {
                    id
                    name
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
          name: name,
          departureCountry: country,
          departureTown: town,
          endCountry: country,
          departureDay: departure_day,
          departureMonth: departure_month,
          departureYear: departure_year,
          endMonth: end_month,
          endYear: end_year,
          note: note
        }
    }
  end

  it 'creates a new trip for an associated user' do
    login_user(email: user[:email], password: password)

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    trip = JSON.parse(response.body).dig('data', 'createTrip', 'trip')
    expect(trip['departurePoint']['town']).to eq(town)
    expect(trip['endPoint']['country']).to eq(country)
    expect(user.trips.first.departure_year).to eq(departure_year)
    expect(user.trips.first.end_year).to eq(end_year)
  end
end
