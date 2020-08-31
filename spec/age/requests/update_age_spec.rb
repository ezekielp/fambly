require 'rails_helper'

RSpec.describe 'update_age mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person_with_age) { create(:person, :with_age) }
  let(:person_with_months_old) { create(:person, :with_months_old) }
  let(:new_age) { person_with_age.age + 10 }
  let(:new_months_old) { person_with_months_old.months_old + 3 }
  let(:query_string) do
    "
        mutation UpdateAge($input: UpdateAgeInput!) {
            updateAge(input: $input) {
                person {
                    id
                    age
                    monthsOld
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end

  it 'updates the age in years of an existing person' do
    variables =
      {
          input: {
              personId: person_with_age.id,
              age: new_age,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person = JSON.parse(response.body).dig('data', 'updateAge', 'person')
    expect(person['age']).to eq(new_age)
  end

  it 'updates the months_old of an existing person' do
    variables =
      {
          input: {
              personId: person_with_months_old.id,
              monthsOld: new_months_old,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person = JSON.parse(response.body).dig('data', 'updateAge', 'person')
    expect(person['monthsOld']).to eq(new_months_old)
  end
end