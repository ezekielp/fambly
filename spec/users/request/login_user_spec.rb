require 'rails_helper'

RSpec.describe 'login mutation', type: :request do
    let(:endpoint) { '/graphql' }
    let(:valid_email) { 'joebob@example.com' }
    let(:invalid_email) { 'dhd3892239dcom' }
    let(:valid_password) { 'hew82hr23ref2KJAhfq!' }
    let(:invalid_password) { '1234567' }

    before(:each) { User.create(email: valid_email, password: valid_password) }

    it 'logs in a user if the credentials are valid' do
        query_string = "
            mutation Login($input: LoginInput!) {
                login(input: $input) {
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

        # debugger
        user_email = JSON.parse(response.body).dig('data', 'login', 'user', 'email')
        expect(user_email).to eq(valid_email)
        expect(controller.current_user.email).to eq(user_email)
    end

end