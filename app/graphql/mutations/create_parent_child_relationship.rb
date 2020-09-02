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
      parent_child = ParentChild.new(
        **input
      )

      if parent_child.save
        return { parent_child_relationship: parent_child }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end