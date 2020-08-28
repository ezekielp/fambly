module Types
  class UpdateNoteInputType < Types::BaseInputObject
    argument :note_id, ID, required: true
    argument :content, String, required: true
  end
end

module Mutations
  class UpdateNote < BaseMutation
    argument :input, Types::UpdateNoteInputType, required: true

    field :note, Types::NoteType, null: true

    def resolve(input:)
      note = Note.find_by(id: input.note_id)

      if note
        note.update(content: input.content)
        return { note: note }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end