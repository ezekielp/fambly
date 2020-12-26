module Types
  class CreateTripStageInputType < Types::BaseInputObject
    argument :trip_id, ID, required: true
    argument :place_name, String, required: false
    argument :place_country, String, required: true
    argument :place_state_or_region, String, required: false
    argument :place_town, String, required: false
    argument :place_street, String, required: false
    argument :place_zip_code, String, required: false
    argument :accommodation_name, String, required: false
    argument :accommodation_country, String, required: false
    argument :accommodation_state_or_region, String, required: false
    argument :accommodation_town, String, required: false
    argument :accommodation_street, String, required: false
    argument :accommodation_zip_code, String, required: false
    argument :start_day, Int, required: false
    argument :start_month, Int, required: false
    argument :start_year, Int, required: false
    argument :end_day, Int, required: false
    argument :end_month, Int, required: false
    argument :end_year, Int, required: false
    argument :note, String, required: false
  end
end

module Mutations
  class CreateTripStage < BaseMutation
    argument :input, Types::CreateTripStageInputType, required: true

    field :trip_stage, Types::TripStageType, null: true

    def resolve(input:)
      place = Place.find_or_create_by(
        name: input.place_name,
        country: input.place_country,
        state_or_region: input.place_state_or_region,
        town: input.place_town,
        street: input.place_street,
        zip_code: input.place_zip_code
      )

      accommodation_name, accommodation_country, accommodation_state_or_region, accommodation_street, accommodation_town, accommodation_zip_code = input.accommodation_name, input.accommodation_country, input.accommodation_state_or_region, input.accommodation_street, input.accommodation_town, input.accommodation_zip_code

      accommodation = nil

      if accommodation_name || accommodation_country || accommodation_state_or_region || accommodation_street || accommodation_town || accommodation_zip_code
        accommodation = Place.find_or_create_by(
          name: accommodation_name,
          country: accommodation_country ? accommodation_country : input.place_country,
          state_or_region: accommodation_state_or_region,
          town: accommodation_town,
          street: accommodation_street,
          zip_code: accommodation_zip_code
        )
      end

      new_trip_stage = TripStage.new(
        trip_id: input.trip_id,
        place_id: place.id,
        accommodation_id: accommodation ? accommodation.id : nil,
        start_day: input.start_day,
        start_month: input.start_month,
        start_year: input.start_year,
        end_day: input.end_day,
        end_month: input.end_month,
        end_year: input.end_year
      )

      if new_trip_stage.save
        if input.note
          trip_stage_note = Note.new(
            content: input.note,
            notable: new_trip_stage
          )
          saved = trip_stage_note.save

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] } unless saved
        end

        return { trip_stage: new_trip_stage }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end