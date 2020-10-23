module Types
  class CreatePersonPlaceInputType < Types::BaseInputObject
    argument :person_id, ID, required: true
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
    argument :note, String, required: false
  end
end

module Mutations
  class CreatePersonPlace < BaseMutation
    argument :input, Types::CreatePersonPlaceInputType, required: true

    field :person_place, Types::PersonPlaceType, null: true

    def resolve(input:)
      country, note = input.country, input.note

      unless country
        return { errors: [{ path: 'country', message: 'Please choose at least a country!' }] }
      end

      place = Place.find_or_create_by(
        country: country,
        state_or_region: input.state_or_region,
        town: input.town,
        street: input.street,
        zip_code: input.zip_code
      )

      person_place = PersonPlace.new(
        person_id: input.person_id,
        place_id: place.id,
        current: input.current,
        place_type: input.place_type,
        start_month: input.start_month,
        start_year: input.start_year,
        end_month: input.end_month,
        end_year: input.end_year
      )

      if person_place.save
        if note
          person_place_note = Note.new(
            content: note,
            notable: person_place
          )
          saved = person_place_note.save

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] } unless saved
        end

        return { person_place: person_place }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
