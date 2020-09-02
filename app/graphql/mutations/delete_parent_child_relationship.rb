module Types
  class DeleteParentChildRelationshipInputType < Types::BaseInputObject
    argument :parent_child_id, ID, required: true
  end
end

module Mutations
  class DeleteParentChildRelationship < BaseMutation
    argument :input, Types::DeleteParentChildRelationshipInputType, required: true

    type Boolean

    def resolve(input:)
      parent_child_relationship = ParentChild.find_by(id: input.parent_child_id)

      if parent_child_relationship
        parent_child_relationship.destroy
        return true
      end
      false
    end
  end
end