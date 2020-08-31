module Types
  class UpdateAgeInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
    argument :age, Int, required: false
    argument :months_old, Int, required: false
  end
end

module Mutations
  class UpdateAge < BaseMutation
    argument :input, Types::UpdateAgeInputType, required: true

    field :person, Types::PersonType, null: true

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      age = input.age
      months_old = input.months_old

      if person
        if age
          person.update(age: age, date_age_added: Date.today)
        elsif months_old
          person.update(months_old: months_old, date_age_added: Date.today)
        end
        
        return { person: person }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end