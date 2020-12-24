module Types
  class TripStageType < Types::BaseObject
    field :id, ID, null: false
    field :trip, Types::TripType, null: false
    field :place, Types::PlaceType, null: false
    field :accommodation, Types::PlaceType, null: true
    field :start_day, Int, null: true
    field :start_month, Int, null: true
    field :start_year, Int, null: true
    field :end_day, Int, null: true
    field :end_month, Int, null: true
    field :end_year, Int, null: true
    field :notes, [Types::NoteType], null: true
  end
end
