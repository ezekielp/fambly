module Types
  class DeleteParentChildRelationshipInputType < Types::BaseInputObject
    argument :parent_id, ID, required: true
    argument :child_id, ID, required: true
  end
end

module Mutations
  class DeleteParentChildRelationship < BaseMutation
    argument :input, Types::DeleteParentChildRelationshipInputType, required: true

    type Boolean

    def resolve(input:)
      parent_child_relationship = ParentChild.find_by(parent_id: input.parent_id, child_id: input.child_id)

      if parent_child_relationship
        parent_child_relationship.destroy
        return true
      end
      false
    end
  end
end