module Types
  class TripStagePersonType < Types::BaseObject
    field :id, ID, null: false
    field :person, Types::PersonType, null: false
    field :trip_stage, Types::TripStageType, null: false
  end
end