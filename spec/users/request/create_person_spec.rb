require 'rails_helper'

RSpec.describe 'create_person mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:password) { 'Schwarzgerat' }
  let(:query_string) do 
    "
        mutation CreatePerson($input: CreatePersonInput!) {
            createPerson(input: $input) {
                person {
                    id
                    firstName
                    lastName
                    notes {
                      id
                      content
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
  let(:variables) do
    {
        input: {
            firstName: 'Joe',
            lastName: 'Bob',
        }
    }
  end

  # use the 'login_user' helper method with the user you create to do the right procedure for using 'current_user.id'
  it 'creates a new person associated with the current_user' do
    login_user(email: user[:email], password: password)

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    person = JSON.parse(response.body).dig('data', 'createPerson', 'person')
    expect(person['firstName']).to eq(controller.current_user.people.first.first_name)
    expect(person['firstName']).to eq('Joe')
  end

end