module Types
  class AmorousRelationshipType < Types::BaseObject
    field :id, ID, null: false
    field :partner_one, Types::PersonType, null: false
    field :partner_two, Types::PersonType, null: false
    field :relationship_type, String, null: true
    field :current, Boolean, null: false
    field :start_day, Int, null: true
    field :start_month, Int, null: true
    field :start_year, Int, null: true
    field :wedding_day, Int, null: true
    field :wedding_month, Int, null: true
    field :wedding_year, Int, null: true
    field :end_day, Int, null: true
    field :end_month, Int, null: true
    field :end_year, Int, null: true
    field :notes, [Types::NoteType], null: true
  end
end