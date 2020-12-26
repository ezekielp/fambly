module Types
  class CreateTripStagePersonInputType < Types::BaseInputObject
    argument :trip_stage_id, ID, required: true
    argument :person_id, ID, required: true
    argument :note, String, required: false
  end
end

module Mutations
  class CreateTripStagePerson < BaseMutation
    argument :input, Types::CreateTripStagePersonInputType, required: true

    field :trip_stage_person, Types::TripStagePersonType, null: true

    def resolve(input:)
      trip_stage_id, person_id = input.trip_stage_id, input.person_id

      if !trip_stage_id || trip_stage_id == ''
        return { errors: [{ path: '', message: 'Please create or choose a trip stage to which to add a person!' }] }
      elsif !person_id || person_id == ''
        return { errors: [{ path: '', message: 'Please choose a person to add to the trip!' }] }
      end

      trip_stage_person = TripStagePerson.new(
        person_id: person_id,
        trip_stage_id: trip_stage_id
      )

      if trip_stage_person.save
        if input.note
          trip_stage_person_note = Note.new(
            content: input.note,
            notable: trip_stage_person
          )
          saved = trip_stage_person_note.save

          return { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
        end
        
        return { trip_stage_person: trip_stage_person }
      end

      { errors: [{ path: '', message: 'Oops! Something went wrong. Please refresh the page and try again.' }] }
    end
  end
end
