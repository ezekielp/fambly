require 'rails_helper'

RSpec.describe 'create_person mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:query_string) do 
    "
        mutation CreatePerson($input: CreatePersonInput!) {
            createUser(input: $input) {
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
  it 'creates a new person associated with a '

end