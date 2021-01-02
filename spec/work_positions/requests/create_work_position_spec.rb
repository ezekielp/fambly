require 'rails_helper'

RSpec.describe 'create_work_position mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:password) { 'Schwarzgerat' }
  let(:person) { Person.create(user_id: user.id, first_name: 'Ken', last_name: 'Thompson') }
  let(:country) { 'USA' }
  let(:town) { 'Holmdel Township' }
  let(:state_or_region) { 'NJ' }
  # let(:place) { Place.create(country: 'USA', town: 'Holmdel Township', state_or_region: 'NJ') }
  let(:title) { 'Designer of Unix' }
  let(:company_name) { 'Bell Labs' }
  let(:description) { 'I did the first of two or three versions of UNIX all alone. And Dennis became an evangelist. Then there was a rewrite in a higher-level language that would come to be called C. He worked mostly on the language and on the I/O system, and I worked on all the rest of the operating system. That was for the PDP-11, which was serendipitous, because that was the computer that took over the academic community.' }
  let(:current) { false }
  let(:work_type) { 'full_time' }
  let(:start_year) { 1966 }
  let(:end_year) { 2000 }
  let(:query_string) do
    "
        mutation CreateWorkPosition($input: CreateWorkPositionInput!) {
            createWorkPosition(input: $input) {
                workPosition {
                    id
                    person {
                      id
                      firstName
                      lastName
                    }
                    place {
                      id
                      country
                      stateOrRegion
                      town
                      street
                      zipCode
                    }
                    title
                    companyName
                    description
                    workType
                    current
                    startYear
                    startMonth
                    endYear
                    endMonth
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
          title: title,
          companyName: company_name,
          description: description,
          current: current,
          country: country,
          town: town,
          stateOrRegion: state_or_region,
          workType: work_type,
          startYear: start_year,
          endYear: end_year,
        }
    }
  end

  it 'creates a work_position entry for an existing person profile' do
    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    work_position = JSON.parse(response.body).dig('data', 'createWorkPosition', 'workPosition')
    expect(work_position['title']).to eq(title)
    expect(work_position['description']).to eq(description)
    expect(work_position['place']['town']).to eq(town)
    expect(person.work_positions.first.company_name).to eq(company_name)
  end
end
