module Types
  class DeleteAgeInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
  end
end

module Mutations
  class DeleteAge < BaseMutation
    argument :input, Types::DeleteAgeInputType, required: true

    type Boolean

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      if person
        person.update(age: nil)
        return true
      end
      false
    end
  end
end