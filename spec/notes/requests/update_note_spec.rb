require 'rails_helper'

RSpec.describe 'update_note mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:person_note) { create(:person_note) }
  let(:person) { person_note.notable }
  let(:new_note_content) { "A skulk of foxes, a cowardice of curs are tonight's traffic whispering in the yards and lanes." }
  let(:query_string) do
    "
        mutation UpdateNote($input: UpdateNoteInput!) {
            updateNote(input: $input) {
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
  
  it 'updates an existing note associated with a particular person profile' do
    variables =
      {
          input: {
              noteId: person_note.id,
              content: new_note_content,
          }
      }
  
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    note = JSON.parse(response.body).dig('data', 'updateNote', 'note')
    expect(note['content']).to eq(new_note_content)
    expect(person.notes.first.content).to eq(new_note_content)
  end

  it 'returns an error if the note_id does not exist' do
    variables =
      {
          input: {
              noteId: 'some-nonexistent-note-id',
              content: new_note_content,
          }
      }
  
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'updateNote')
    expect(mutation_response['errors']).not_to be_nil
    expect(mutation_response['note']).to be_nil
  end
end