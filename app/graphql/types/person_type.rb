module Types
  class PersonType < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: false
    field :middle_name, String, null: true
    field :last_name, String, null: true
    field :gender, String, null: true
    field :show_on_dashboard, Boolean, null: false
    field :age, Int, null: true
    field :months_old, Int, null: true
    field :birth_year, Int, null: true
    field :birth_month, Int, null: true
    field :birth_day, Int, null: true
    field :tags, [Types::TagType], null: true
    field :notes, [Types::NoteType], null: true
    field :parents, [Types::PersonType], null: true
    field :children, [Types::PersonType], null: true
    field :siblings, [Types::PersonType], null: true
    field :person_places, [Types::PersonPlaceType], null: true

    def age
      object.age_from_full_birthdate || object.approximate_age_from_birth_year || object.approximate_current_age_from_age
    end

    def months_old
      return nil if self.age && self.age > 1

      object.months_old_from_full_birthdate || object.approximate_months_old_from_months_old
    end

    def parents
      child_parent_relationships.then do |child_parent_relationship_list|
        parent_ids = child_parent_relationship_list.map(&:parent_id)
        RecordLoader.for(Person).load_many(parent_ids)
      end
    end

    def children
      parent_child_relationships.then do |parent_child_relationship_list|
        children_ids = parent_child_relationship_list.map(&:child_id)
        RecordLoader.for(Person).load_many(children_ids)
      end
    end

    def notes
      AssociationLoader.for(Person, :notes).load(object)
    end

    def person_places
      AssociationLoader.for(Person, :person_places).load(object)
    end

    # possible TO DO: Figure out a way to preload siblings

    private

    def parent_child_relationships
      AssociationLoader.for(Person, :parent_child_relationships).load(object)
    end

    def child_parent_relationships
      AssociationLoader.for(Person, :child_parent_relationships).load(object)
    end
  end
end