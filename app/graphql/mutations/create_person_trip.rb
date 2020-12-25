module Types
  class CreatePersonTripInputType < Types::BaseInputObject
    argument :trip_id, ID, required: true
    argument :person_id, ID, required: true
  end
end

module Mutations
  class CreatePersonTrip < BaseMutation
    argument :input, Types::CreatePersonTripInputType, required: true

    field :person_trip, Types::PersonTripType, null: true

    def resolve(input:)
      trip_id, person_id = input.trip_id, input.person_id

      if !trip_id || trip_id == ''
        return { errors: [{ path: '', message: 'Please create or choose a trip to which to add a person!' }] }
      elsif !person_id || person_id == ''
        return { errors: [{ path: '', message: 'Please choose a person to add to the trip!' }] }
      end

      person_trip = PersonTrip.new(
        person_id: person_id,
        trip_id: trip_id
      )

      if person_trip.save
        return { person_trip: person_trip }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
