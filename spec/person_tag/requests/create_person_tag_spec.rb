require 'rails_helper'

RSpec.describe 'create_person_tag mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:password) { 'Schwarzgerat' }
  let(:person) { Person.create(user_id: user.id, first_name: 'Blaise', last_name: 'Pascal') }
  let(:tag) { Tag.create(user_id: user.id, name: 'gophers', color: '#02a4d3') }
  let(:query_string) do
    "
        mutation CreatePersonTag($input: CreatePersonTagInput!) {
            createPersonTag(input: $input) {
                personTag {
                    id
                    person {
                      id
                      firstName
                      lastName
                    }
                    tag {
                      id
                      name
                      color
                    }
                }
                errors {
                    path
                    message
                }
            }
        }
    "
  end

  describe "when a tag with the given name doesn't exist yet" do
    it 'creates a tag and creates a person_tag association between the tag and an existing person' do
      login_user(email: user[:email], password: password)

      variables = 
        {
          input: {
            personId: person.id,
            name: 'Child prodigies',
            color: '#002366',
          }
        }

      post(
        endpoint,
        params: { query: query_string, variables: variables }
      )

      person_tag = JSON.parse(response.body).dig('data', 'createPersonTag', 'personTag')
      expect(person_tag['person']['firstName']).to eq(person.first_name)
      expect(person_tag['tag']['name']).to eq('Child prodigies')
      expect(person.tags.first.color).to eq('#002366')
    end
  end

  describe 'when a tag with the given name already exists' do
    it 'creates a person_tag association between the tag and an existing person' do
      login_user(email: user[:email], password: password)

      variables = 
        {
          input: {
            personId: person.id,
            name: tag.name,
          }
        }

      post(
        endpoint,
        params: { query: query_string, variables: variables }
      )
      
      person_tag = JSON.parse(response.body).dig('data', 'createPersonTag', 'personTag')
      expect(person_tag['person']['firstName']).to eq(person.first_name)
      expect(person_tag['tag']['name']).to eq(tag.name)
      expect(person.tags.first.color).to eq(tag.color)
    end
  end
end
