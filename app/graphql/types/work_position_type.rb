module Types
  class WorkPositionType < Types::BaseObject
    field :id, ID, null: false
    field :person, Types::PersonType, null: false
    field :company_name, String, null: true
    field :title, String, null: true
    field :current, Boolean, null: true
    field :description, String, null: true
    field :end_month, Int, null: true
    field :end_year, Int, null: true
    field :start_month, Int, null: true
    field :start_year, Int, null: true
    field :work_type, String, null: true
    field :place, Types::PlaceType, null: true
    field :notes, [Types::NoteType], null: true
  end
end
