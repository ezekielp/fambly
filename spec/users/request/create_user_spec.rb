require 'rails_helper'

RSpec.describe 'create mutation', type: :request do
    let(:endpoint) { '/graphql' }
    let(:valid_password) { 'hew82hr23ref2KJAhfq!' }
    let(:invalid_password) { '1234567' }
    let(:valid_email) { 'joebob@example.com' }
    let(:invalid_email) { 'dhd3892239dcom' }

    it 'creates a new user if the validations pass' do
        query_string = "
            mutation CreateUser($input: CreateUserInput!) {
                createUser(input: $input) {
                    user {
                        id
                        email
                    }
                }
            }
        "

        variables = {
            input: {
                email: valid_email,
                password: valid_password
            }
        }

        post(
            endpoint,
            params: { query: query_string, variables: variables }
        )

        expect(User.find_by_credentials(valid_email, valid_password)).not_to be_nil
    end
end