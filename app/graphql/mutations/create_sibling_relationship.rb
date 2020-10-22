module Types
  class CreateSiblingRelationshipInputType < Types::BaseInputObject
    argument :first_name, String, required: false
    argument :last_name, String, required: false
    argument :show_on_dashboard, Boolean, required: false
    argument :sibling_one_id, ID, required: true
    argument :sibling_two_id, ID, required: false
    argument :sibling_type, String, required: false
    argument :note, String, required: false
  end
end

module Mutations
  class CreateSiblingRelationship < BaseMutation
    argument :input, Types::CreateSiblingRelationshipInputType, required: true

    field :sibling_relationship, Types::SiblingRelationshipType, null: true

    def resolve(input:)
      sibling_relationship = nil

      if input.sibling_two_id
        sibling_relationship = SiblingRelationship.new(
          sibling_one_id: input.sibling_one_id,
          sibling_two_id: input.sibling_two_id,
          sibling_type: input.sibling_type
        )
      else
        new_person = Person.new(
          user_id: current_user.id,
          first_name: input.first_name,
          last_name: input.last_name,
          show_on_dashboard: input.show_on_dashboard
        )
        if new_person.save
          sibling_relationship = SiblingRelationship.new(
            sibling_one_id: input.sibling_one_id,
            sibling_two_id: new_person.id,
            sibling_type: input.sibling_type
          )
        else
          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
        end
      end

      if sibling_relationship && sibling_relationship.save
        if input.note
          sibling_note = Note.new(
            content: input.note,
            notable: sibling_relationship
          )

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] } unless sibling_note.save
        end

        return { sibling_relationship: sibling_relationship }
      else
        return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
      end
    end
  end
end
