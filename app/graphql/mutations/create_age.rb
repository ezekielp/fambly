module Types
  class CreateAgeInputType < Types::BaseInputObject
    argument :age, Int, required: false
    argument :months_old, Int, required: false
    argument :person_id, ID, required: true
  end
end

module Mutations
  class CreateAge < BaseMutation
    argument :input, Types::CreateAgeInputType, required: true

    field :person, Types::PersonType, null: true

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      unless person
        return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
      end

      age = input.age
      months_old = input.months_old

      if age && months_old
        return { errors: [{ path: '', message: 'Please provide age in either years or months, not both' }] }
      end

      if age
        person.update(age: age)
      elsif months_old
        person.update(months_old: months_old)
      end

      { person: person }
    end
  end
end