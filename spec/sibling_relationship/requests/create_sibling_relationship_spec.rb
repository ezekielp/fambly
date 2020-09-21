require 'rails_helper'

RSpec.describe 'create_sibling_relationship mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:password) { 'Schwarzgerat' }
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
    variables =
      {
          input: {
              siblingOneId: sibling_one.id,
              siblingTwoId: sibling_two.id,
              siblingType: sibling_type,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    sibling_relationship = JSON.parse(response.body).dig('data', 'createSiblingRelationship', 'siblingRelationship')
    expect(sibling_relationship['siblingOne']['firstName']).to eq(sibling_one.first_name)
    expect(sibling_relationship['siblingTwo']['firstName']).to eq(sibling_two.first_name)
    expect(sibling_one.siblings[0].first_name).to eq(sibling_two.first_name)
    expect(sibling_two.siblings[0].first_name).to eq(sibling_one.first_name)
  end

  it 'creates a new person, then creates a sibling_relationship entry between the new person and an existing entry in the people table' do
    login_user(email: user[:email], password: password)

    variables =
      {
          input: {
              firstName: 'Jucifer',
              lastName: 'Bernoulli',
              siblingOneId: sibling_one.id
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    sibling_relationship = JSON.parse(response.body).dig('data', 'createSiblingRelationship', 'siblingRelationship')
    expect(sibling_relationship['siblingOne']['firstName']).to eq(sibling_one.first_name)
    expect(sibling_relationship['siblingTwo']['firstName']).to eq('Jucifer')
    expect(sibling_one.siblings[0].first_name).to eq('Jucifer')
  end
end
