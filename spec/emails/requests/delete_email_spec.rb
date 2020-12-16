require 'rails_helper'

RSpec.describe 'delete_email mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:email) { 'dick.feynman@mit.edu' }
  let(:email_type) { 'school' }
  let(:query_string) do
    "
        mutation DeleteEmail($input: DeleteEmailInput!) {
            deleteEmail(input: $input)
        }
    "
  end

  it 'deletes an existing email and returns true if the email existed' do
    email_entry = Email.create(person_id: person.id, email: email, email_type: email_type)
    variables =
      {
          input: {
              emailId: email_entry.id,
          }
      }
  
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteEmail')
    expect(mutation_response).to be true
    expect(person.emails).to be_empty
  end
end