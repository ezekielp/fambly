require 'rails_helper'

RSpec.describe 'delete_sibling_relationship mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:sibling_one) { Person.create(user_id: user.id, first_name: 'Johann', last_name: 'Bernoulli') }
  let(:sibling_two) { Person.create(user_id: user.id,first_name: 'Jacob', last_name: 'Bernoulli') }
  let(:query_string) do
    "
        mutation DeleteSiblingRelationship($input: DeleteSiblingRelationshipInput!) {
            deleteSiblingRelationship(input: $input)
        }
    "
  end

  it 'deletes an existing sibling_relationship and returns true if the sibling_relationship entry existed' do
    sibling_relationship = SiblingRelationship.create(sibling_one_id: sibling_one.id, sibling_two_id: sibling_two.id)

    variables =
      {
          input: {
            siblingOneId: sibling_one.id,
            siblingTwoId: sibling_two.id,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteSiblingRelationship')
    expect(mutation_response).to be true
    expect(sibling_one.siblings).to be_empty
    expect(sibling_two.siblings).to be_empty
  end

  it 'does nothing and returns false if the sibling_relationship_id does not exist' do
    SiblingRelationship.create(sibling_one_id: sibling_one.id, sibling_two_id: sibling_two.id)

    variables =
      {
          input: {
              siblingOneId: 'non-existent-sibling-one-id',
              siblingTwoId: 'non-existent-sibling-two-id',
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteSiblingRelationship')
    expect(mutation_response).to be false
  end
end
