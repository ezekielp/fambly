module Types
  class UpdateTagInputType < Types::BaseInputObject
    argument :tag_id, ID, required: true
    argument :name, String, required: false
    argument :color, String, required: false
  end
end

module Mutations
  class UpdateTag < BaseMutation
    argument :input, Types::UpdateTagInputType, required: true

    field :tag, Types::TagType, null: true

    def resolve(input:)
      tag = Tag.find_by(id: input.tag_id)

      if tag
        tag.update(name: input.name, color: input.color)

        return { tag: tag }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end