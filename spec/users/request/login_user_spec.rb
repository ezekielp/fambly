require 'rails_helper'

RSpec.describe 'login mutation', type: :request do
    let(:endpoint) { '/graphql' }
    let(:valid_email) { 'joebob@example.com' }
    let(:invalid_email) { 'dhd3892239dcom' }
    let(:valid_password) { 'hew82hr23ref2KJAhfq!' }
    let(:incorrect_password) { '123456789' }

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

        user_email = JSON.parse(response.body).dig('data', 'login', 'user', 'email')
        expect(user_email).to eq(valid_email)
        expect(controller.current_user.email).to eq(user_email)
    end

    it 'returns nil if the credentials are incorrect' do
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
                password: incorrect_password
            }
        }

        post(
            endpoint,
            params: { query: query_string, variables: variables }
        )


        login_response = JSON.parse(response.body).dig('data', 'login', 'user')
        expect(login_response).to be_nil
        expect(controller.current_user).to be_nil
    end

end