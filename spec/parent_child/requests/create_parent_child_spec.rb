require 'rails_helper'

RSpec.describe 'create_parent_child mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:parent) { Person.create(user_id: user.id, first_name: 'Miksa', last_name: 'Neumann') }
  let(:child) { Person.create(user_id: user.id,first_name: 'Janos Lajos', last_name: 'Neumann') }
  let(:parent_type) { 'biological' }
  let(:query_string) do
    "
        mutation CreateParentChildRelationship($input: CreateParentChildRelationshipInput!) {
            createParentChildRelationship(input: $input) {
                parentChildRelationship {
                    id
                    parent {
                      id
                      firstName
                      lastName
                    }
                    child {
                      id
                      firstName
                      lastName
                    }
                    parentType
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
            parentId: parent.id,
            childId: child.id,
            parentType: parent_type,
        }
    }
  end

  it 'creates a parent_child relationship between two entries in the people table' do
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    parent_child_relationship = JSON.parse(response.body).dig('data', 'createParentChildRelationship', 'parentChildRelationship')
    expect(parent_child_relationship['parent']['firstName']).to eq(parent.first_name)
    expect(parent_child_relationship['child']['firstName']).to eq(child.first_name)
    expect(parent.children.first.first_name).to eq(child.first_name)
    expect(child.parents.first.first_name).to eq(parent.first_name)
  end
end
