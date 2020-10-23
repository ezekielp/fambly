module Types
  class UpdatePersonPlaceInputType < Types::BaseInputObject
    argument :person_place_id, ID, required: true
    argument :country, String, required: true
    argument :state_or_region, String, required: false
    argument :town, String, required: false
    argument :street, String, required: false
    argument :zip_code, String, required: false
    argument :place_type, String, required: false
    argument :current, Boolean, required: false
    argument :start_month, Int, required: false
    argument :start_year, Int, required: false
    argument :end_month, Int, required: false
    argument :end_year, Int, required: false
  end
end

module Mutations
  class UpdatePersonPlace < BaseMutation
    argument :input, Types::UpdatePersonPlaceInputType, required: true

    field :person_place, Types::PersonPlaceType, null: true

    def resolve(input:)
      person_place = PersonPlace.find_by(id: input.person_place_id)

      if person_place
        place = Place.find_or_create_by(
          country: input.country,
          state_or_region: input.state_or_region,
          town: input.town,
          street: input.street,
          zip_code: input.zip_code
        )

        person_place.update(
          place_id: place.id,
          current: input.current,
          place_type: input.place_type,
          start_month: input.start_month,
          start_year: input.start_year,
          end_month: input.end_month,
          end_year: input.end_year
        )

        return { person_place: person_place }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end



