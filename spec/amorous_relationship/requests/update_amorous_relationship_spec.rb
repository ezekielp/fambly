require 'rails_helper'

RSpec.describe 'update amorous_relationship mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:partner_one) { Person.create(user_id: user.id, first_name: 'Jerome', last_name: 'Karle') }
  let(:partner_two) { Person.create(user_id: user.id, first_name: 'Isabella', last_name: 'Karle') }
  let(:new_relationship_type) { 'marriage' }
  let(:wedding_year) { 1942 }
  let(:query_string) do
    "
        mutation UpdateAmorousRelationship($input: UpdateAmorousRelationshipInput!) {
            updateAmorousRelationship(input: $input) {
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
                    current
                    startYear
                    startMonth
                    startDay
                    weddingYear
                    weddingMonth
                    weddingDay
                    endYear
                    endMonth
                    endDay
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
          partnerOneId: partner_one.id,
          partnerTwoId: partner_two.id,
          relationshipType: new_relationship_type,
          weddingYear: wedding_year,
          current: true,
      }
    }
  end

  it 'updates an existing amorous_relationship' do
    amorous_relationship = AmorousRelationship.create(partner_one_id: partner_one.id, partner_two_id: partner_two.id, relationship_type: 'dating', start_year: 1940)

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    amorous_relationship.reload

    updated_amorous_relationship = JSON.parse(response.body).dig('data', 'updateAmorousRelationship', 'amorousRelationship')
    expect(updated_amorous_relationship['relationshipType']).to eq(new_relationship_type)
    expect(updated_amorous_relationship['weddingYear']).to eq(wedding_year)
    expect(amorous_relationship.relationship_type).to eq(new_relationship_type)
    expect(amorous_relationship.wedding_year).to eq(wedding_year)
  end
end
