module Types
  class UpdateSiblingRelationshipInputType < Types::BaseInputObject
    argument :sibling_one_id, ID, required: true
    argument :sibling_two_id, ID, required: true
    argument :sibling_type, String, required: false
  end
end

module Mutations
  class UpdateSiblingRelationship < BaseMutation
    argument :input, Types::UpdateSiblingRelationshipInputType, required: true

    field :sibling_relationship, Types::SiblingRelationshipType, null: true

    def resolve(input:)
      sibling_relationship = SiblingRelationship.find_by(sibling_one_id: input.sibling_one_id, sibling_two_id: input.sibling_two_id) || SiblingRelationship.find_by(sibling_one_id: input.sibling_two_id, sibling_two_id: input.sibling_one_id)

      if sibling_relationship
        sibling_relationship.update(sibling_type: input.sibling_type)

        return { sibling_relationship: sibling_relationship }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end