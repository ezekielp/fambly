module Types
  class CreateNoteInputType < Types::BaseInputObject
    argument :content, String, required: true
    argument :person_id, ID, required: true
  end
end

module Mutations
  class CreateNote < BaseMutation
    argument :input, Types::CreateNoteInputType, required: true

    field :note, Types::NoteType, null: true

    def resolve(input:)
      note = Note.new(
        content: input.content,
        person_id: input.person_id
      )

      if note.save
        return { note: note }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end