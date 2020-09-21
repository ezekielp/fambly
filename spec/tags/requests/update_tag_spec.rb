require 'rails_helper'

RSpec.describe 'update_tag mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:user) { create(:user) }
  let(:tag) { Tag.create(user_id: user.id, name: 'gophers', color: '#02a4d3') }
  let(:new_name) { 'rubyists' }
  let(:new_color) { '#A51502' }
  let(:query_string) do
    "
        mutation UpdateTag($input: UpdateTagInput!) {
            updateTag(input: $input) {
                tag {
                    id
                    user {
                      id
                    }
                    name
                    color
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
            tagId: tag.id,
            name: new_name,
            color: new_color,
        }
    }
  end

  it 'updates an existing tag' do
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    tag = JSON.parse(response.body).dig('data', 'updateTag', 'tag')
    expect(tag['name']).to eq(new_name)
    expect(tag['color']).to eq(new_color)
  end
end


