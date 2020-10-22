module Types
  class DeleteAmorousRelationshipInputType < Types::BaseInputObject
    argument :partner_one_id, ID, required: true
    argument :partner_two_id, ID, required: true
  end
end

module Mutations
  class DeleteAmorousRelationship < BaseMutation
    argument :input, Types::DeleteAmorousRelationshipInputType, required: true

    type Boolean

    def resolve(input:)
      amorous_relationship = AmorousRelationship.find_by(partner_one_id: input.partner_one_id, partner_two_id: input.partner_two_id) || AmorousRelationship.find_by(partner_one_id: input.partner_two_id, partner_two_id: input.partner_one_id)

      if amorous_relationship
        amorous_relationship.destroy
        return true
      end
      false
    end
  end
end