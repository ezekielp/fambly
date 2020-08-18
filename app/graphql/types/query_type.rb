module Types
  class QueryType < Types::BaseObject
    field :user, Types::UserType, null: true
  end
end
