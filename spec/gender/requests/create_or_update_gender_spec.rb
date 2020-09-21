require 'rails_helper'

RSpec.describe 'create_or_update_gender mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:gender) { 'female' }
  let(:query_string) do
    "
        mutation CreateOrUpdateGender($input: CreateOrUpdateGenderInput!) {
            createOrUpdateGender(input: $input) {
                person {
                    id
                    gender
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end

  it 'adds gender information to a person when the data is valid' do
    variables = 
      {
        input: {
            personId: person.id,
            gender: gender,
        }
      }
      
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    person.reload
  
    returned_person = JSON.parse(response.body).dig('data', 'createOrUpdateGender', 'person')
    expect(returned_person['gender']).to eq(gender)
    expect(person.gender).to eq(gender)
  end

  it 'returns an error when an empty string is passed as the gender variable' do
    variables = 
      {
        input: {
            personId: person.id,
            gender: '',
        }
      }
      
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )
  
    mutation_response = JSON.parse(response.body).dig('data', 'createOrUpdateGender')
    expect(mutation_response['errors']).not_to be_nil
  end

  it 'updates the gender of a person whose gender already exists' do
    person.update(gender: 'male')
    variables = 
      {
        input: {
            personId: person.id,
            gender: 'non-binary',
        }
      }
    
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    person.reload
  
    returned_person = JSON.parse(response.body).dig('data', 'createOrUpdateGender', 'person')
    expect(returned_person['gender']).to eq('non-binary')
    expect(person.gender).to eq('non-binary')
  end

end
