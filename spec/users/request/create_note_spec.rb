require 'rails_helper'

RSpec.describe 'create_note mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person) { create(:person) }
  let(:note_content) { 'Pirate was always a bit of a rascal. Some people never change' }
  let(:query_string) do
    "
        mutation CreateNote($input: CreateNoteInput!) {
            createNote(input: $input) {
                note {
                    id
                    content
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
            personId: person.id,
            content: note_content,
        }
    }
  end

  it 'creates a note associated with a particular person' do
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    note = JSON.parse(response.body).dig('data', 'createNote', 'note')
    expect(note['content']).to eq(note_content)
    expect(person.notes.first.content).to eq(note_content)
  end

end