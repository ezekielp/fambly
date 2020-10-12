module Types
  class DeletePersonPlaceInputType < Types::BaseInputObject
    argument :person_place_id, ID, required: true
  end
end

module Mutations
  class DeletePersonPlace < BaseMutation
    argument :input, Types::DeletePersonPlaceInputType, required: true

    type Boolean

    def resolve(input:)
      person_place = PersonPlace.find_by(id: input.person_place_id)

      if person_place
        person_place.destroy
        return true
      end
      false
    end
  end
end
