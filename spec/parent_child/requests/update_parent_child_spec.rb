require 'rails_helper'

RSpec.describe 'update_parent_child mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:parent) { Person.create(user_id: user.id, first_name: 'Miksa', last_name: 'Neumann') }
  let(:child) { Person.create(user_id: user.id,first_name: 'Janos Lajos', last_name: 'Neumann') }
  let(:parent_child_relationship) { ParentChild.create(parent_id: parent.id, child_id: child.id, parent_type: 'biological') }
  let(:new_parent_type) { 'step_parent' }
  let(:note) { "John's father, Neumann Miksa (Max von Neumann, 1873–1928) was a banker, who held a doctorate in law." }
  let(:query_string) do
    "
        mutation UpdateParentChildRelationship($input: UpdateParentChildRelationshipInput!) {
            updateParentChildRelationship(input: $input) {
                parentChildRelationship {
                    id
                    parentType
                    note
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
            parentChildId: parent_child_relationship.id,
            parentType: new_parent_type,
            note: note,
        }
    }
  end

  it 'updates an existing parent_child relationship' do
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    parent_child_relationship.reload

    updated_parent_child_relationship = JSON.parse(response.body).dig('data', 'updateParentChildRelationship', 'parentChildRelationship')
    expect(updated_parent_child_relationship['parentType']).to eq(new_parent_type)
    expect(updated_parent_child_relationship['note']).to eq(note)
    expect(parent_child_relationship.parent_type).to eq(new_parent_type)
    expect(parent_child_relationship.note).to eq(note)
  end
end
