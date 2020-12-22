require 'rails_helper'

RSpec.describe 'update_email mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:old_email) { 'donna.strickland@waterloo.edu' }
  let(:new_email) { 'donna.lasers@waterloo.edu' }
  let(:email_type) { 'school' }
  let(:query_string) do
    "
        mutation UpdateEmail($input: UpdateEmailInput!) {
            updateEmail(input: $input) {
                email {
                    id
                    emailAddress
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

  it 'updates an existing email associated with a particular person' do
    original_email = Email.create(person_id: person.id, email_address: old_email, email_type: email_type)
    variables =
      {
        input: {
            emailId: original_email.id,
            emailAddress: new_email,
        }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    email = JSON.parse(response.body).dig('data', 'updateEmail', 'email')
    expect(email['emailAddress']).to eq(new_email)
    expect(person.emails.first.email_address).to eq(new_email)
  end
end