module Types
  class MutationType < Types::BaseObject
    # User auth
    field :create_user, mutation: Mutations::CreateUser
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout

    # Person + person fields
    field :create_person, mutation: Mutations::CreatePerson
    field :create_note, mutation: Mutations::CreateNote
    field :update_note, mutation: Mutations::UpdateNote
    field :delete_note, mutation: Mutations::DeleteNote
    field :create_age, mutation: Mutations::CreateAge
    field :update_age, mutation: Mutations::UpdateAge
    field :create_or_update_birthdate, mutation: Mutations::CreateOrUpdateBirthdate
  end
end
