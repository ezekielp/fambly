module Types
  class CreatePersonTagInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
    argument :name, String, required: true
    argument :color, String, required: false
  end
end

module Mutations
  class CreatePersonTag < BaseMutation
    argument :input, Types::CreatePersonTagInputType, required: true

    field :person_tag, Types::PersonTagType, null: true

    def resolve(input:)
      tag = Tag.find_or_create_by(
        user_id: current_user.id,
        name: input.name
      )
      unless tag.color
        tag.update(color: input.color)
      end

      person_tag = PersonTag.new(
        person_id: input.person_id,
        tag_id: tag.id
      )

      if person_tag.save
        return { person_tag: person_tag }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end