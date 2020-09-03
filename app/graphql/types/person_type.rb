module Types
  class PersonType < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: false
    field :last_name, String, null: true
    field :show_on_dashboard, Boolean, null: false
    field :age, Int, null: true
    field :months_old, Int, null: true
    field :birth_year, Int, null: true
    field :birth_month, Int, null: true
    field :birth_day, Int, null: true
    field :notes, [Types::NoteType], null: true
    field :parents, [Types::PersonType], null: true
    field :children, [Types::PersonType], null: true

    def age
      object.age_from_full_birthdate || object.approximate_age_from_birth_year || object.approximate_current_age_from_age
    end

    def months_old
      return nil if self.age && self.age > 23

      object.months_old_from_full_birthdate || object.approximate_months_old_from_months_old
    end
  end
end