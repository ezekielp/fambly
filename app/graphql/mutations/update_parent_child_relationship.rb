module Types
  class UpdateParentChildRelationshipInputType < Types::BaseInputObject
    argument :parent_id, ID, required: true
    argument :child_id, ID, required: true
    argument :parent_type, String, required: false
  end
end

module Mutations
  class UpdateParentChildRelationship < BaseMutation
    argument :input, Types::UpdateParentChildRelationshipInputType, required: true

    field :parent_child_relationship, Types::ParentChildType, null: true

    def resolve(input:)
      parent_child_relationship = ParentChild.find_by(parent_id: input.parent_id, child_id: input.child_id)

      parent_type = input.parent_type

      if parent_child_relationship
        parent_child_relationship.update(parent_type: parent_type) if parent_type

        return { parent_child_relationship: parent_child_relationship }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end