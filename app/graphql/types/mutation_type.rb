module Types
  class MutationType < Types::BaseObject
    # User auth
    field :create_user, mutation: Mutations::CreateUser
    field :login, mutation: Mutations::Login
    field :logout, mutation: Mutations::Logout

    # Dummy users
    field :create_dummy_user, mutation: Mutations::CreateDummyUser

    # Person + person fields
    field :create_person, mutation: Mutations::CreatePerson
    field :update_person, mutation: Mutations::UpdatePerson
    field :delete_person, mutation: Mutations::DeletePerson
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

    # Emails
    field :create_email, mutation: Mutations::CreateEmail
    field :update_email, mutation: Mutations::UpdateEmail
    field :delete_email, mutation: Mutations::DeleteEmail

    # Parent-child relationship
    field :create_parent_child_relationship, mutation: Mutations::CreateParentChildRelationship
    field :update_parent_child_relationship, mutation: Mutations::UpdateParentChildRelationship
    field :delete_parent_child_relationship, mutation: Mutations::DeleteParentChildRelationship

    # Sibling relationship
    field :create_sibling_relationship, mutation: Mutations::CreateSiblingRelationship
    field :update_sibling_relationship, mutation: Mutations::UpdateSiblingRelationship
    field :delete_sibling_relationship, mutation: Mutations::DeleteSiblingRelationship

    # Amorous relationship
    field :create_amorous_relationship, mutation: Mutations::CreateAmorousRelationship
    field :update_amorous_relationship, mutation: Mutations::UpdateAmorousRelationship
    field :delete_amorous_relationship, mutation: Mutations::DeleteAmorousRelationship

    # Person-places
    field :create_person_place, mutation: Mutations::CreatePersonPlace
    field :update_person_place, mutation: Mutations::UpdatePersonPlace
    field :delete_person_place, mutation: Mutations::DeletePersonPlace

    # Tags
    field :create_person_tag, mutation: Mutations::CreatePersonTag
    field :update_tag, mutation: Mutations::UpdateTag
    field :delete_person_tag, mutation: Mutations::DeletePersonTag

    # Trips
    field :create_trip, mutation: Mutations::CreateTrip
  end
end
