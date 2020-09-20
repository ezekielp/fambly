require 'rails_helper'

RSpec.describe 'create_sibling_relationship mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:sibling_one) { Person.create(user_id: user.id, first_name: 'Johann', last_name: 'Bernoulli') }
  let(:sibling_two) { Person.create(user_id: user.id,first_name: 'Jacob', last_name: 'Bernoulli') }
  let(:sibling_type) { 'biological' }
  let(:query_string) do
    "
        mutation CreateSiblingRelationship($input: CreateSiblingRelationshipInput!) {
            createSiblingRelationship(input: $input) {
                siblingRelationship {
                    id
                    siblingOne {
                      id
                      firstName
                      lastName
                    }
                    siblingTwo {
                      id
                      firstName
                      lastName
                    }
                    siblingType
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end
  
  it 'creates a sibling_relationship entry between two existing entries in the people table' do
    let(:variables) do
      {
          input: {
              siblingOneId: sibling_one.id,
              siblingTwoId: sibling_two.id,
              siblingType: sibling_type,
          }
      }
    end  

  end
  it 'creates a new person, then creates a sibling_relationship entry between the new person and an existing entry in the people table' do
    let(:variables) do
      {
          input: {
              firstName: 'Jucifer',
              lastName: 'Bernoulli'
              siblingOneId: sibling_one.id,
          }
      }
    end

  end
end
