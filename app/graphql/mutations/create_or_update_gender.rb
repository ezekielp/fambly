module Types
  class CreateOrUpdateGenderInputType < Types::BaseInputObject
    argument :gender, String, required: true
    argument :person_id, ID, required: true
  end
end

module Mutations
  class CreateOrUpdateGender < BaseMutation
    argument :input, Types::CreateOrUpdateGenderInputType, required: true

    field :person, Types::PersonType, null: true

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      unless person
        return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
      end

      gender = input.gender

      unless gender && gender.length > 0
        return { errors: [{ path: 'gender', message: 'You must choose a gender to save to this profile, or hit the cancel button!' }] }
      end

      person.update(gender: gender)

      { person: person }
    end
  end
end