module Types
  class ParentChildInputType < Types::BaseInputObject
    argument :parent_id, String, required: true
    argument :child_id, String, required: true
  end
end