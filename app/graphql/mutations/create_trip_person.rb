module Types
  class CreateTripPersonInputType < Types::BaseInputObject
    argument :trip_id, ID, required: true
    argument :person_id, ID, required: true
    argument :note, String, required: false
  end
end

module Mutations
  class CreateTripPerson < BaseMutation
    argument :input, Types::CreateTripPersonInputType, required: true

    field :trip_person, Types::TripPersonType, null: true

    def resolve(input:)
      trip_id, person_id = input.trip_id, input.person_id

      if !trip_id || trip_id == ''
        return { errors: [{ path: '', message: 'Please create or choose a trip to which to add a person!' }] }
      elsif !person_id || person_id == ''
        return { errors: [{ path: '', message: 'Please choose a person to add to the trip!' }] }
      end

      trip_person = TripPerson.new(
        person_id: person_id,
        trip_id: trip_id
      )

      if trip_person.save
        if input.note
          trip_person_note = Note.new(
            content: input.note,
            notable: trip_person
          )
          saved = trip_person_note.save

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
        end
        
        return { trip_person: trip_person }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
