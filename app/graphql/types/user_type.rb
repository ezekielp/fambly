module Types
    class UserType < Types::BaseObject
        field :id, ID, null: false
        field :email, String, null: false
        field :people, [Types::PersonType], null: true
    end
end