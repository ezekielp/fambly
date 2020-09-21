require 'rails_helper'

RSpec.describe 'delete_person_tag mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:person) { Person.create(user_id: user.id, first_name: 'Blaise', last_name: 'Pascal') }
  let(:tag) { Tag.create(user_id: user.id, name: 'gophers', color: '#02a4d3') }
  let(:query_string) do
    "
        mutation DeletePersonTag($input: DeletePersonTagInput!) {
            deletePersonTag(input: $input)
        }
    "
  end

  it 'deletes an existing person_tag relationship and returns true if the person_tag entry existed' do
    PersonTag.create(person_id: person.id, tag_id: tag.id)

    variables =
      {
          input: {
            personId: person.id,
            tagId: tag.id,
          }
      }

    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deletePersonTag')
    expect(mutation_response).to be true
    expect(person.tags).to be_empty
    expect(tag.people).to be_empty
  end
end
