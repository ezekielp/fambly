module Types
  class DeletePersonTagInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
    argument :tag_id, ID, required: true
  end
end

module Mutations
  class DeletePersonTag < BaseMutation
    argument :input, Types::DeletePersonTagInputType, required: true

    type Boolean

    def resolve(input:)
      person_tag = PersonTag.find_by(person_id: input.person_id, tag_id: input.tag_id)

      if person_tag
        person_tag.destroy
        return true
      end
      false
    end
  end
end