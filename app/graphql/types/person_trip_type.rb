module Types
  class PersonTripType < Types::BaseObject
    field :id, ID, null: false
    field :person, Types::PersonType, null: false
    field :trip, Types::TripType, null: false
  end
end