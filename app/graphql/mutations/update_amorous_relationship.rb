module Types
  class UpdateAmorousRelationshipInputType < Types::BaseInputObject
    argument :partner_one_id, ID, required: true
    argument :partner_two_id, ID, required: true
    argument :relationship_type, String, required: false
    argument :current, Boolean, required: false
    argument :start_year, Int, required: false
    argument :start_month, Int, required: false
    argument :start_day, Int, required: false
    argument :wedding_year, Int, required: false
    argument :wedding_month, Int, required: false
    argument :wedding_day, Int, required: false
    argument :end_year, Int, required: false
    argument :end_month, Int, required: false
    argument :end_day, Int, required: false
  end
end

module Mutations
  class UpdateAmorousRelationship < BaseMutation
    argument :input, Types::UpdateAmorousRelationshipInputType, required: true

    field :amorous_relationship, Types::AmorousRelationshipType, null: true

    def resolve(input:)
      amorous_relationship = AmorousRelationship.find_by(partner_one_id: input.partner_one_id, partner_two_id: input.partner_two_id) || 
      AmorousRelationship.find_by(partner_one_id: input.partner_two_id, partner_two_id: input.partner_one_id)

      if amorous_relationship
        amorous_relationship.update(
          relationship_type: input.relationship_type,
          current: input.current,
          start_year: input.start_year,
          start_month: input.start_month,
          start_day: input.start_day,
          wedding_year: input.wedding_year,
          wedding_month: input.wedding_month,
          wedding_day: input.wedding_day,
          end_year: input.end_year,
          end_month: input.end_month,
          end_day: input.end_day,
        )

        return { amorous_relationship: amorous_relationship }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
