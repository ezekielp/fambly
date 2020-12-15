require 'rails_helper'

RSpec.describe 'create_email mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:email) { 'dick.feynman@mit.edu' }
  let(:email_type) { 'school' }
  let(:query_string) do
    "
        mutation CreateEmail($input: CreateEmailInput!) {
            createEmail(input: $input) {
                email {
                    id
                    email
                    emailType
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
            email: email,
            emailType: email_type,
        }
    }
  end

  it 'creates an email address associated with a particular person' do
    post(
      endpoint,
      params: { query: query_string, variables: variables }  
    )

    email_response = JSON.parse(response.body).dig('data', 'createEmail', 'email')
    expect(email_response['email']).to eq(email)
    expect(email_response['emailType']).to eq(email_type)
    expect(person.emails.first.email).to eq(email)
  end
end

