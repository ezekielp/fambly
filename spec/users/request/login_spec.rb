require 'rails_helper'

RSpec.describe 'login mutation', type: :request do
    after do
        travel_back
    end

    let(:endpoint) { '/graphql' }
    let(:valid_email) { 'joebob@example.com' }
    let(:invalid_email) { 'dhd3892239dcom' }
    let(:valid_password) { 'hew82hr23ref2KJAhfq!' }
    let(:incorrect_password) { '123456789' }
    let(:query_string) do
        "
            mutation Login($input: LoginInput!) {
                login(input: $input) {
                    user {
                        id
                        email
                    }
                }
            }
        "
    end

    before(:each) { User.create(email: valid_email, password: valid_password) }

    it 'logs in a user if the credentials are valid' do
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

    it 'expires an inactive session after 45 days' do
        user = User.find_by_credentials(valid_email, valid_password)

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

        user_id = JSON.parse(response.body).dig('data', 'login', 'user', 'id')
        expect(controller.current_user.id).to eq(user.id)

        travel_to(44.days.from_now)
        expect(controller.current_user.id).to eq(user.id)

        travel_to(46.days.from_now)
        expect(controller.current_user).to be_nil

    end
end
