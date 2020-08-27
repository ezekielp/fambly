module Types
  class DeleteNoteInputType < Types::BaseInputObject
    argument :note_id, ID, required: true
  end
end

module Mutations
  class DeleteNote < BaseMutation
    argument :input, Types::DeleteNoteInputType, required: true

    type Boolean

    def resolve(input:)
      note = Note.find_by(id: input.note_id)

      if note
        note.destroy
        return true
      end
      false
    end
  end
end