require 'rails_helper'

RSpec.describe 'update sibling_relationship mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:sibling_one) { Person.create(user_id: user.id, first_name: 'Johann', last_name: 'Bernoulli') }
  let(:sibling_two) { Person.create(user_id: user.id,first_name: 'Jacob', last_name: 'Bernoulli') }
  let(:new_sibling_type) { 'step_sibling' }
  let(:query_string) do
    "
        mutation UpdateSiblingRelationship($input: UpdateSiblingRelationshipInput!) {
            updateSiblingRelationship(input: $input) {
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
  let(:variables) do
    {
        input: {
            siblingOneId: sibling_one.id,
            siblingTwoId: sibling_two.id,
            siblingType: new_sibling_type,
        }
    }
  end

  it 'updates an existing sibling_relationship' do
    sibling_relationship = SiblingRelationship.create(sibling_one_id: sibling_one.id, sibling_two_id: sibling_two.id, sibling_type: 'biological')

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    sibling_relationship.reload

    updated_sibling_relationship = JSON.parse(response.body).dig('data', 'updateSiblingRelationship', 'siblingRelationship')
    expect(updated_sibling_relationship['siblingType']).to eq(new_sibling_type)
    expect(sibling_relationship.sibling_type).to eq(new_sibling_type)
  end
end