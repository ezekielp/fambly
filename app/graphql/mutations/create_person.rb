module Types
  class CreatePersonInputType < Types::BaseInputObject
    argument :first_name, String, required: true
    argument :last_name, String, required: false
  end
end

module Mutations
  class CreatePerson < BaseMutation
    argument :input, Types::CreatePersonInputType, required: true

    field :person, Types::PersonType, null: true

    def resolve(input:)
      person = Person.new(
        first_name: input.first_name,
        user_id: current_user.id
      )

      if input.last_name
        person.last_name = input.last_name
      end

      if person.save
        return { person: person }
      end

      { errors: [{ path: '', message: 'You must supply at least a first name when adding a new person!' }] }
    end
  end
end