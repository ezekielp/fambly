module Types
  class TagType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :people, [Types::PersonType], null: true
    field :name, String, null: false
    field :color, String, null: true
  end
end