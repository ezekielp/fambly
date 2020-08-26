module Types
  class MutationType < Types::BaseObject
    # User auth
    field :create_user, mutation: Mutations::CreateUser
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout

    # Person + person fields
    field :create_person, mutation: Mutations::CreatePerson
  end
end
