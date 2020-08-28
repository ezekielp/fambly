module Types
  class PersonType < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: false
    field :last_name, String, null: true
    field :age, Int, null: true
    field :age_in_months, Int, null: true
    field :birth_year, Int, null: true
    field :birth_month, String, null: true
    field :birth_day, Int, null: true
    field :notes, [Types::NoteType], null: true

    def age
      person = object.person
      # person = Person.find_by(id: object.id)
      
      person.age_from_full_birthdate || person.approximate_age_from_birth_year || person.approximate_current_age_from_age
    end

    def age_in_months
      person = object.person
      # person = Person.find_by(id: object.id)

      person.months_old_from_full_birthdate || person.approximate_months_old_from_months_old
    end
  end
end