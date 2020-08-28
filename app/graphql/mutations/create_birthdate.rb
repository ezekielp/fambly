module Types
  class CreateBirthdateInputType < Types::BaseInputObject
    argument :birth_year, Int, required: false
    argument :birth_month, String, required: false
    argument :birth_day, Int, required: false
    argument :person_id, ID, required: true
  end
end

module Mutations
  class CreateBirthdate < BaseMutation
    argument :input, Types::CreateBirthdateInputType, required: true

    field :person, Types::PersonType, null: true

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      unless person
        return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
      end

      return { person: person } if person.update(
        birth_year: input.birth_year,
        birth_month: input.birth_month,
        birth_day: input.birth_day
      )
      
      {
        errors: person.errors.messages.map { |path, messages| { path: path, message: messages.join('. ') } }
      }
    end
  end
end