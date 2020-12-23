module Types
  class TripType < Types::BaseObject
    field :id, ID, null: false
    field :departure_point, Types::PlaceType, null: true
    field :end_point, Types::PlaceType, null: true
    field :departure_day, Int, null: true
    field :departure_month, Int, null: true
    field :departure_year, Int, null: true
    field :end_day, Int, null: true
    field :end_month, Int, null: true
    field :end_year, Int, null: true
  end
end