require 'rails_helper'

RSpec.describe 'create_amorous_relationship mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:password) { 'Schwarzgerat' }
  let(:partner_one) { Person.create(user_id: user.id, first_name: 'Marie', last_name: 'Curie') }
  let(:partner_two) { Person.create(user_id: user.id, first_name: 'Pierre', last_name: 'Curie') }
  let(:relationship_type) { 'marriage' }
  let(:query_string) do
    "
        mutation CreateAmorousRelationship($input: CreateAmorousRelationshipInput!) {
            createAmorousRelationship(input: $input) {
                amorousRelationship {
                    id
                    partnerOne {
                      id
                      firstName
                      lastName
                    }
                    partnerTwo {
                      id
                      firstName
                      lastName
                    }
                    relationshipType
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end

  describe 'when both partners already exist in the people table' do
    it 'creates an amorous_relationship entry between the two patners' do
      variables =
      {
          input: {
              partnerOneId: partner_one.id,
              partnerTwoId: partner_two.id,
              relationshipType: relationship_type,
          }
      }

      post(
        endpoint,
        params: { query: query_string, variables: variables }
      )

      amorous_relationship = JSON.parse(response.body).dig('data', 'createAmorousRelationship', 'amorousRelationship')
      expect(amorous_relationship['partnerOne']['firstName']).to eq(partner_one.first_name)
      expect(amorous_relationship['partnerTwo']['firstName']).to eq(partner_two.first_name)
      expect(partner_one.partners[0].first_name).to eq(partner_two.first_name)
      expect(partner_two.partners[0].first_name).to eq(partner_one.first_name)
    end
  end

  describe 'when partner_two does not yet exist' do
    it 'creates a new person, then creates an amorous_relationship between the new person and an existing entry in the people table' do
      login_user(email: user[:email], password: password)
      new_partner_one = Person.create(user_id: user.id, first_name: 'Marie-Anne', last_name: 'Lavoisier')

      variables =
        {
            input: {
                firstName: 'Antoine',
                lastName: 'Lavoisier',
                partnerOneId: new_partner_one.id
            }
        }

      post(
        endpoint,
        params: { query: query_string, variables: variables }
      )
            
      amorous_relationship = JSON.parse(response.body).dig('data', 'createAmorousRelationship', 'amorousRelationship')
      expect(amorous_relationship['partnerOne']['firstName']).to eq(new_partner_one.first_name)
      expect(amorous_relationship['partnerTwo']['firstName']).to eq('Antoine')
      expect(new_partner_one.partners[0].first_name).to eq('Antoine')
    end
  end
end