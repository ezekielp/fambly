module Types
  class ParentChildType < Types::BaseObject
    field :id, ID, null: false
    field :parent, Types::PersonType, null: false
    field :child, Types::PersonType, null: false
    field :parent_type, String, null: true
    field :notes, [Types::NoteType], null: true
  end
end