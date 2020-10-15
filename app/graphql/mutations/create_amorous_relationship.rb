module Types
  class CreateAmorousRelationshipInputType < Types::BaseInputObject
    argument :first_name, String, required: false
    argument :last_name, String, required: false
    argument :show_on_dashboard, Boolean, required: false
    argument :partner_one_id, ID, required: true
    argument :partner_two_id, ID, required: false
    argument :relationship_type, String, required: false
    argument :note, String, required: false
  end
end

module Mutations
  class CreateAmorousRelationship < BaseMutation
    argument :input, Types::CreateAmorousRelationshipInputType, required: true

    field :amorous_relationship, Types::AmorousRelationshipType, null: true

    def resolve(input:)
      amorous_relationship = nil

      if input.partner_two_id
        amorous_relationship = AmorousRelationship.new(
          partner_one_id: input.partner_one_id,
          partner_two_id: input.partner_two_id,
          relationship_type: input.relationship_type
        )
      else
        new_person = Person.new(
          user_id: current_user.id,
          first_name: input.first_name,
          last_name: input.last_name,
          show_on_dashboard: input.show_on_dashboard
        )
        if new_person.save
          amorous_relationship = AmorousRelationship.new(
            partner_one_id: input.partner_one_id,
            partner_two_id: new_person.id,
            relationship_type: input.relationship_type
          )  
        else
          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
        end
      end

      if amorous_relationship && amorous_relationship.save
        if input.note
          amorous_relationship_note = Note.new(
            content: input.note,
            notable: amorous_relationship
          )

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] } unless amorous_relationship_note.save
        end

        return { amorous_relationship: amorous_relationship }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end