module Types
  class DeletePersonInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
  end
end

module Mutations
  class DeletePerson < BaseMutation
    argument :input, Types::DeletePersonInputType, required: true

    type Boolean

    def resolve(input:)
      person = Person.find_by(id: input.person_id)

      if person
        person.destroy
        return true
      end
      false
    end
  end
end
