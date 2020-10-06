module Types
  class DummyEmailType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    field :user, Types::UserType, null: false
  end
end