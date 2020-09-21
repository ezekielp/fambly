module Types
  class SiblingRelationshipInputType < Types::BaseInputObject
    argument :sibling_one_id, String, required: true
    argument :sibling_two_id, String, required: true
  end
end