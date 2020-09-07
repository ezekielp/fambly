module Types
  class MutationType < Types::BaseObject
    # User auth
    field :create_user, mutation: Mutations::CreateUser
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout

    # Person + person fields
    field :create_person, mutation: Mutations::CreatePerson
    field :create_person_note, mutation: Mutations::CreatePersonNote
    field :create_or_update_gender, mutation: Mutations::CreateOrUpdateGender
    field :delete_gender, mutation: Mutations::DeleteGender
    field :update_note, mutation: Mutations::UpdateNote
    field :delete_note, mutation: Mutations::DeleteNote
    field :create_age, mutation: Mutations::CreateAge
    field :update_age, mutation: Mutations::UpdateAge
    field :delete_age, mutation: Mutations::DeleteAge
    field :create_or_update_birthdate, mutation: Mutations::CreateOrUpdateBirthdate
    field :delete_birthdate, mutation: Mutations::DeleteBirthdate

    # Parent-child relationship
    field :create_parent_child_relationship, mutation: Mutations::CreateParentChildRelationship
    field :update_parent_child_relationship, mutation: Mutations::UpdateParentChildRelationship
    field :delete_parent_child_relationship, mutation: Mutations::DeleteParentChildRelationship

    # Person-places
    field :create_person_place, mutation: Mutations::CreatePersonPlace
    field :update_person_place, mutation: Mutations::UpdatePersonPlace
  end
end
