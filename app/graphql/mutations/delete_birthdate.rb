module Types
  class DeleteBirthdateInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
  end
end

module Mutations
  class DeleteBirthdate < BaseMutation
    argument :input, Types::DeleteBirthdateInputType, required: true

    type Boolean

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      if person
        person.update(birth_year: nil, birth_month: nil, birth_day: nil)
        return true
      end
      false
    end
  end
end