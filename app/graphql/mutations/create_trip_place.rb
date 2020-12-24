module Types
  class CreateTripPlaceInputType < Types::BaseInputObject
    argument :trip_stage_id, ID, required: true
    argument :place_name, String, required: true
    argument :place_country, String, required: true
    argument :place_state_or_region, String, required: false
    argument :place_town, String, required: false
    argument :place_street, String, required: false
    argument :place_zip_code, String, required: false
    argument :place_type, String, required: false
    argument :visit_day, Int, required: false
    argument :visit_month, Int, required: false
    argument :visit_year, Int, required: false
    argument :note, String, required: false
  end
end

module Mutations
  class CreateTripPlace < BaseMutation
    argument :input, Types::CreateTripPlaceInputType, required: true

    field :trip_place, Types::TripPlaceType, null: true

    def resolve(input:)
      place = Place.find_or_create_by(
        name: input.place_name,
        country: input.place_country,
        state_or_region: input.place_state_or_region,
        town: input.place_town,
        street: input.place_street,
        zip_code: input.place_zip_code
      )

      new_trip_place = TripPlace.new(
        trip_stage_id: input.trip_stage_id,
        place_id: place.id,
        place_type: input.place_type,
        visit_day: input.visit_day,
        visit_month: input.visit_month,
        visit_year: input.visit_year
      )

      if new_trip_place.save
        if input.note
          trip_place_note = Note.new(
            content: input.note,
            notable: new_trip_place
          )
          saved = trip_place_note.save

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] } unless saved
        end

        return { trip_place: new_trip_place }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
