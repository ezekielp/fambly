module Types
  class AmorousRelationshipType < Types::BaseObject
    field :id, ID, null: false
    field :partner_one, Types::PersonType, null: false
    field :partner_two, Types::PersonType, null: false
    field :relationship_type, String, null: true
    field :notes, [Types::NoteType], null: true
  end
end