module Types
  class UpdatePersonInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
    argument :first_name, String, required: false
    argument :middle_name, String, required: false
    argument :last_name, String, required: false
  end
end

module Mutations
  class UpdatePerson < BaseMutation
    argument :input, Types::UpdatePersonInputType, required: true

    field :person, Types::PersonType, null: true

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      first_name = input.first_name

      if person
        if first_name
          person.update(first_name: first_name)
        end

        person.update(
          middle_name: input.middle_name,
          last_name: input.last_name,
        )
      end

      return { person: person } if person.save

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
