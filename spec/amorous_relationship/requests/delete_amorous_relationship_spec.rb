require 'rails_helper'

RSpec.describe 'delete_amorous_relationship mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:partner_one) { Person.create(user_id: user.id, first_name: 'Jerome', last_name: 'Karle') }
  let(:partner_two) { Person.create(user_id: user.id, first_name: 'Isabella', last_name: 'Karle') }
  let(:query_string) do
    "
        mutation DeleteAmorousRelationship($input: DeleteAmorousRelationshipInput!) {
            deleteAmorousRelationship(input: $input)
        }
    "
  end

  it 'deletes an existing amorous_relationship and returns true if the amorous_relationship entry existed' do
    amorous_relationship = AmorousRelationship.create(partner_one_id: partner_one.id, partner_two_id: partner_two.id, relationship_type: 'marriage')

    variables =
      {
          input: {
            partnerOneId: partner_one.id,
            partnerTwoId: partner_two.id,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteAmorousRelationship')
    expect(mutation_response).to be true
    expect(partner_one.partners).to be_empty
    expect(partner_two.partners).to be_empty
  end

  it 'does nothing and returns false if the amorous_relationship_id does not exist' do
    amorous_relationship = AmorousRelationship.create(partner_one_id: partner_one.id, partner_two_id: partner_two.id, relationship_type: 'marriage')

    variables =
      {
          input: {
              partnerOneId: 'non-existent-partner-one-id',
              partnerTwoId: 'non-existent-partner-two-id',
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )
  
    mutation_response = JSON.parse(response.body).dig('data', 'deleteAmorousRelationship')
    expect(mutation_response).to be false
  end
end
