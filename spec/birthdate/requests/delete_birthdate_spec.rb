require 'rails_helper'

RSpec.describe 'delete_birthdate mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person_with_birthdate) { create(:person, :with_full_birthdate) }
  let(:query_string) do
    "
        mutation DeleteBirthdate($input: DeleteBirthdateInput!) {
            deleteBirthdate(input: $input)
        }
    "
  end

  it 'deletes the birthdate from a person and returns true if the person no longer has a birthdate associated with them' do
    variables =
      {
          input: {
              personId: person_with_birthdate.id,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person_with_birthdate.reload

    mutation_response = JSON.parse(response.body).dig('data', 'deleteBirthdate')
    expect(mutation_response).to be true
    expect(person_with_birthdate.birth_year).to be_nil
    expect(person_with_birthdate.birth_month).to be_nil
    expect(person_with_birthdate.birth_day).to be_nil
  end

  it 'does nothing and returns false if the person_id does not exist' do
    variables =
      {
          input: {
              personId: 'non-existent-person-id',
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteBirthdate')
    expect(mutation_response).to be false
  end
end