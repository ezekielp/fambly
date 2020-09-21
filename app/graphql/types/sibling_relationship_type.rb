module Types
  class SiblingRelationshipType < Types::BaseObject
    field :id, ID, null: false
    field :sibling_one, Types::PersonType, null: false
    field :sibling_two, Types::PersonType, null: false
    field :sibling_type, String, null: true
    field :notes, [Types::NoteType], null: true
  end
end