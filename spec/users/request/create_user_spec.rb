require 'rails_helper'

RSpec.describe 'create_user mutation', type: :request do
    let(:endpoint) { '/graphql' }
    let(:valid_password) { 'hew82hr23ref2KJAhfq!' }
    let(:invalid_password) { '1234567' }
    let(:valid_email) { 'joebob@example.com' }
    let(:invalid_email) { 'dhd3892239dcom' }
    let(:query_string) do 
        "
            mutation CreateUser($input: CreateUserInput!) {
                createUser(input: $input) {
                    user {
                        id
                        email
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
                email: valid_email,
                password: valid_password
            }
        }
    end

    it 'creates a new user if the validations pass' do
        post(
            endpoint,
            params: { query: query_string, variables: variables }
        )

        expect(User.find_by_credentials(valid_email, valid_password)).not_to be_nil
    end

    it 'returns an error if the email address already exists' do
        User.create(email: valid_email, password: valid_password)

        post(
            endpoint,
            params: { query: query_string, variables: variables }
        )

        create_user_response = JSON.parse(response.body).dig('data', 'createUser')
        expect(create_user_response["errors"]).not_to be_nil
        expect(create_user_response["user"]).to be_nil
    end
end