require 'rails_helper'

RSpec.describe 'delete_note mutation', type: :request do
  let(:endpoint) { '/graphql' }
  let(:note) { create(:note) }
  let(:person) { note.person }
  let(:query_string) do
    "
        mutation DeleteNote($input: DeleteNoteInput!) {
            deleteNote(input: $input)
        }
    "
  end

  it 'deletes an existing note and returns true if the note existed' do
    variables =
      {
          input: {
              noteId: note.id,
          }
      }
  
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteNote')
    expect(mutation_response).to be true
    expect(person.notes).to be_empty
  end

  it 'does nothing and returns false if the note_id does not exist' do
    variables =
      {
          input: {
              noteId: 'non-existent-note-id',
          }
      }
  
    post(
      endpoint,
      params: { query: query_string, variables: variables }
    )

    mutation_response = JSON.parse(response.body).dig('data', 'deleteNote')
    expect(mutation_response).to be false
  end

end