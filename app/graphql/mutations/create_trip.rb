module Types
  class CreateTripInputType < Types::BaseInputObject
    argument :name, String, required: true
    argument :departure_country, String, required: false
    argument :departure_town, String, required: false
    argument :departure_region, String, required: false
    argument :end_country, String, required: false
    argument :end_town, String, required: false
    argument :end_region, String, required: false
    argument :departure_day, Int, required: false
    argument :departure_month, Int, required: false
    argument :departure_year, Int, required: false
    argument :end_day, Int, required: false
    argument :end_month, Int, required: false
    argument :end_year, Int, required: false
    argument :note, String, required: false
  end
end

module Mutations
  class CreateTrip < BaseMutation
    argument :input, Types::CreateTripInputType, required: true

    field :trip, Types::TripType, null: true

    def resolve(input:)
      departure_country, departure_town, departure_region = input.departure_country, input.departure_town, input.departure_region

      end_country, end_town, end_region = input.end_country, input.end_town, input.end_region

      departure_point, end_point = nil, nil

      if departure_country || departure_town || departure_region
        departure_point = Place.find_or_create_by(
          country: departure_country,
          state_or_region: departure_region,
          town: departure_town
        )
      end

      if end_country || end_town || end_region
        end_point = Place.find_or_create_by(
          country: end_country,
          state_or_region: end_region,
          town: end_town
        )
      end

      new_trip = Trip.new(
        user_id: current_user.id,
        name: input.name,
        departure_point_id: departure_point ? departure_point.id : nil,
        end_point_id: end_point ? end_point.id : nil,
        departure_day: input.departure_day,
        departure_month: input.departure_month,
        departure_year: input.departure_year,
        end_day: input.end_day,
        end_month: input.end_month,
        end_year: input.end_year
      )

      if new_trip.save
        if input.note
          trip_note = Note.new(
            content: input.note,
            notable: new_trip
          )
          saved = trip_note.save

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] } unless saved
        end

        return { trip: new_trip }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
