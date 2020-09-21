module Types
  class PersonTagType < Types::BaseObject
    field :id, ID, null: false
    field :tag, Types::TagType, null: false
    field :person, Types::PersonType, null: false
  end
end