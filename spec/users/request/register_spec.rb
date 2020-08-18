require 'rails_helper'

RSpec.describe 'register mutation', type: :request do
    after do
        travel_back
    end

    let(:endpoint) { '/graphql' }
    let(:valid_password) { 'hew82hr23ref2KJAhfq!' }
    let(:invalid_password) { '1234567' }
    let(:valid_email) { 'joebob@example.com' }
    let(:invalid_email) { 'dhd3892239dcom' }

    it 'registers a new user if the validations pass' do
        query_string = "
            mutation RegisterUser($input: RegisterUserInput!) {
                registerUser(input: $input) {
                    user {
                        id
                        email
                    }
                }
            }
        "

        variables = {
            input: {
                data: {
                    email: valid_email,
                    password: valid_password
                }
            }
        }

        post(
            endpoint,
            params: { query: query_string, variables: variables }
        )

        expect(User.find_by_credentials(valid_email, valid_password)).not_to be_nil
    end


end