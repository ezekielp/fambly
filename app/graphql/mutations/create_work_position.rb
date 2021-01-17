module Types
  class CreateWorkPositionInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
    argument :title, String, required: false
    argument :company_name, String, required: false
    argument :description, String, required: false
    argument :current, Boolean, required: false
    argument :end_month, Int, required: false
    argument :end_year, Int, required: false
    argument :start_month, Int, required: false
    argument :start_year, Int, required: false
    argument :work_type, String, required: false
    argument :country, String, required: false
    argument :town, String, required: false
    argument :state_or_region, String, required: false
  end
end

module Mutations
  class CreateWorkPosition < BaseMutation
    argument :input, Types::CreateWorkPositionInputType, required: true

    field :work_position, Types::WorkPositionType, null: true

    def resolve(input:)
      place = nil

      if input.country
        place = Place.find_or_create_by(
          country: input.country,
          town: input.town,
          state_or_region: input.state_or_region
        )
      end

      work_position = WorkPosition.new(
        person_id: input.person_id,
        company_name: input.company_name,
        current: input.current,
        description: input.description,
        end_month: input.end_month,
        end_year: input.end_year,
        start_month: input.start_month,
        start_year: input.start_year,
        title: input.title,
        work_type: input.work_type,
        place_id: place ? place.id : nil
      )

      if work_position.save
        return { work_position: work_position }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
