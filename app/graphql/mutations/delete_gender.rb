module Types
  class DeleteGenderInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
  end
end

module Mutations
  class DeleteGender < BaseMutation
    argument :input, Types::DeleteGenderInputType, required: true

    type Boolean

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      if person
        person.update(gender: nil)
        return true
      end
      false
    end
  end
end