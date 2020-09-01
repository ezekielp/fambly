module Types
  class ParentChildType < Types::BaseObject
    field :id, ID, null: false
    field :parent, Types::PersonType, null: false
    field :child, Types::PersonType, null: false
    field :parent_type, String, null: true
    field :note, String, null: true
  end
end