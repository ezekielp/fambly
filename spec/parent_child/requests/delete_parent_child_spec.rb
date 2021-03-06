require 'rails_helper'

RSpec.describe 'delete_parent_child_relationship mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:parent) { Person.create(user_id: user.id, first_name: 'Miksa', last_name: 'Neumann') }
  let(:child) { Person.create(user_id: user.id,first_name: 'Janos Lajos', last_name: 'Neumann') }
  let(:query_string) do
    "
        mutation DeleteParentChildRelationship($input: DeleteParentChildRelationshipInput!) {
            deleteParentChildRelationship(input: $input)
        }
    "
  end

  it 'deletes an existing parent_child relationship and returns true if the parent_child entry existed' do
    ParentChild.create(parent_id: parent.id, child_id: child.id)

    variables =
      {
          input: {
            parentId: parent.id,
            childId: child.id,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteParentChildRelationship')
    expect(mutation_response).to be true
    expect(parent.children).to be_empty
    expect(child.parents).to be_empty
  end

  it 'does nothing and returns false if the parent_child_id does not exist' do
    ParentChild.create(parent_id: parent.id, child_id: child.id)

    variables =
      {
          input: {
              parentId: 'non-existent-parent-id',
              childId: 'non-existent-child-id',
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteParentChildRelationship')
    expect(mutation_response).to be false
  end
end
