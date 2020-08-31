require 'rails_helper'

RSpec.describe 'create_age mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:age) { 27 }
  let(:months_old) { 18 }
  let(:query_string) do
    "
        mutation CreateAge($input: CreateAgeInput!) {
            createAge(input: $input) {
                person {
                    id
                    age
                    monthsOld
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end

  it 'adds age to a person profile when only age is provided' do
    variables = 
      {
        input: {
            personId: person.id,
            age: age
        }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person.reload

    returned_person = JSON.parse(response.body).dig('data', 'createAge', 'person')
    expect(returned_person['age']).to eq(age)
    expect(person.age).to eq(age)
    expect(person.date_age_added).to eq(Date.today)
  end

  it 'adds months_old to a person profile when only months_old is provided' do
    variables = 
      {
        input: {
          personId: person.id,
          monthsOld: months_old,
        }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person.reload

    returned_person = JSON.parse(response.body).dig('data', 'createAge', 'person')
    expect(returned_person['monthsOld']).to eq(months_old)
    expect(person.months_old).to eq(months_old)
    expect(person.date_age_added).to eq(Date.today)
  end

  it 'returns an error when both age and months_old are provided' do
    variables = 
      {
        input: {
            personId: person.id,
            age: age,
            monthsOld: months_old,
        }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    person.reload

    mutation_response = JSON.parse(response.body).dig('data', 'createAge')
    expect(mutation_response['errors']).not_to be_nil
    expect(mutation_response['person']).to be_nil
    expect(person.date_age_added).to be_nil
  end

  it 'does nothing and returns the person object' do
    variables = 
      {
        input: {
          personId: person.id,
        }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables.to_json }
    )

    returned_person = JSON.parse(response.body).dig('data', 'createAge', 'person')
    expect(person.age).to be_nil  
    expect(person.months_old).to be_nil  
    expect(person.date_age_added).to be_nil
  end

end