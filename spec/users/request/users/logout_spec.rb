require 'rails_helper'

RSpec.describe 'logout mutation', type: :request do
    let(:endpoint) { '/graphql' }
    let(:query_string) do
        "
            mutation Logout {
                logout
            }
        "
    end
    let(:user) { create(:user) }
    let(:password) { 'Schwarzgerat' }

    it 'logs out the user if one is logged in' do
        login_user(email: user[:email], password: password)

        post(
            endpoint,
            params: { query: query_string }
        )

        expect(controller.current_user).to be_nil
    end

    it 'does nothing if no user is logged in' do
        post(
            endpoint,
            params: { query: query_string }
        )

        expect(JSON.parse(response.body).dig('data', 'logout')).to be false
        expect(controller.current_user).to be_nil
    end

end
