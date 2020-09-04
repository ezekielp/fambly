module Types
  class CreateParentChildRelationshipInputType < Types::BaseInputObject
    argument :parent_id, ID, required: true
    argument :child_id, ID, required: true
    argument :parent_type, String, required: false
    argument :note, String, required: false
  end
end

module Mutations
  class CreateParentChildRelationship < BaseMutation
    argument :input, Types::CreateParentChildRelationshipInputType, required: true

    field :parent_child_relationship, Types::ParentChildType, null: true

    def resolve(input:)
      parent_id, child_id, parent_type, note = input.parent_id, input.child_id, input.parent_type, input.note

      if !parent_id
        return { errors: [{ path: '', message: 'Please create or choose a parent to add!' }] }
      elsif !child_id
        return { errors: [{ path: '', message: 'Please create or choose a child to add!' }] }
      end

      parent_child = ParentChild.new(
        parent_id: parent_id,
        child_id: child_id,
        parent_type: input.parent_type
      )

      if parent_child.save
        if note
          parent_child_note = Note.new(
            content: input.note,
            notable: parent_child
          )
          saved = parent_child_note.save

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] } unless saved
        end

        return { parent_child_relationship: parent_child }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end