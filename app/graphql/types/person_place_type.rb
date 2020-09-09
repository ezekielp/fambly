module Types
  class PersonPlaceType < Types::BaseObject
    field :id, ID, null: false
    field :place, Types::PlaceType, null: false
    field :person, Types::PersonType, null: false
    field :birth_place, Boolean, null: true
    field :current, Boolean, null: true
    field :start_month, Int, null: true
    field :start_year, Int, null: true
    field :end_month, Int, null: true
    field :end_year, Int, null: true
    field :notes, [Types::NoteType], null: true
  end

  def place
    RecordLoader.for(Place).load(object.place_id)
  end
  
  def person
    RecordLoader.for(Person).load(object.person_id)
  end

  def notes
    AssociationLoader.for(PersonPlace, :notes).load(object)
  end
end