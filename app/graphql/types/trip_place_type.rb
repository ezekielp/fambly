module Types
  class TripPlaceType < Types::BaseObject
    field :id, ID, null: false
    field :trip_stage, Types::TripStageType, null: false
    field :place, Types::PlaceType, null: false
    field :place_type, String, null: true
    field :visit_day, Int, null: true
    field :visit_month, Int, null: true
    field :visit_year, Int, null: true
    field :notes, [Types::NoteType], null: true
  end
end