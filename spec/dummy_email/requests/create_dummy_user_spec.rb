require 'rails_helper'

RSpec.describe 'create_dummy_user mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:query_string) do
    "
        mutation CreateDummyUser {
            createDummyUser {
                dummyEmail {
                    id
                    email
                    user {
                      id
                      email
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

  it 'creates a fake email address, creates a dummy user associated with that email address, and creates a DummyEmail with the fake email address and dummy user' do
    post(
      endpoint,
      params: { query: query_string }
    )

    dummy_email = JSON.parse(response.body).dig('data', 'createDummyUser', 'dummyEmail')
    expect(dummy_email['user']['email']).to eq(dummy_email['email'])
    expect(DummyEmail.find(dummy_email['id'])).not_to be_nil
  end
end