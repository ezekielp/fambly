module Types
  class AmorousRelationshipInputType < Types::BaseInputObject
    argument :partner_one_id, String, required: true
    argument :partner_two_id, String, required: true
  end
end