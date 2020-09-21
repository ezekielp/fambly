module Types
  class DeleteSiblingRelationshipInputType < Types::BaseInputObject
    argument :sibling_one_id, ID, required: true
    argument :sibling_two_id, ID, required: true
  end
end

module Mutations
  class DeleteSiblingRelationship < BaseMutation
    argument :input, Types::DeleteSiblingRelationshipInputType, required: true

    type Boolean

    def resolve(input:)
      sibling_relationship = SiblingRelationship.find_by(sibling_one_id: input.sibling_one_id, sibling_two_id: input.sibling_two_id) || SiblingRelationship.find_by(sibling_one_id: input.sibling_two_id, sibling_two_id: input.sibling_one_id)

      if sibling_relationship
        sibling_relationship.destroy
        return true
      end
      false
    end
  end
end