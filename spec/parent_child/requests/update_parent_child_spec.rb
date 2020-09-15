require 'rails_helper'

RSpec.describe 'update_parent_child mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:parent) { Person.create(user_id: user.id, first_name: 'Miksa', last_name: 'Neumann') }
  let(:child) { Person.create(user_id: user.id,first_name: 'Janos Lajos', last_name: 'Neumann') }
  let(:new_parent_type) { 'step_parent' }
  let(:query_string) do
    "
        mutation UpdateParentChildRelationship($input: UpdateParentChildRelationshipInput!) {
            updateParentChildRelationship(input: $input) {
                parentChildRelationship {
                    id
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
            parentType: new_parent_type,
        }
    }
  end

  it 'updates an existing parent_child relationship' do
    parent_child_relationship = ParentChild.create(parent_id: parent.id, child_id: child.id, parent_type: 'biological')
    
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    parent_child_relationship.reload

    updated_parent_child_relationship = JSON.parse(response.body).dig('data', 'updateParentChildRelationship', 'parentChildRelationship')
    expect(updated_parent_child_relationship['parentType']).to eq(new_parent_type)
    expect(parent_child_relationship.parent_type).to eq(new_parent_type)
  end
end
