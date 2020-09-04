module Types
  class CreatePersonNoteInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
    argument :content, String, required: true
  end
end

module Mutations
  class CreatePersonNote < BaseMutation
    argument :input, Types::CreatePersonNoteInputType, required: true

    field :note, Types::NoteType, null: true

    def resolve(input:)
      person_id = input.person_id

      person = Person.find(person_id)

      note = Note.new(
        content: input.content,
        notable: person
      )

      if note.save
        return { note: note }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end