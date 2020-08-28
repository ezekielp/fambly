module Types
  class PersonType < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: false
    field :last_name, String, null: true
    field :age, Int, null: true
    field :months_old, Int, null: true
    field :birth_year, Int, null: true
    field :birth_month, String, null: true
    field :birth_day, Int, null: true
    field :notes, [Types::NoteType], null: true
  end
end