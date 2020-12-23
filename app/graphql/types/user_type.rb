module Types
    class UserType < Types::BaseObject
        field :id, ID, null: false
        field :email, String, null: false
        field :people, [Types::PersonType], null: true
        field :tags, [Types::TagType], null: true
        field :trips, [Types::TripType], null: true
        field :dummy_email, Types::DummyEmailType, null: true

        def tags
            AssociationLoader.for(User, :tags).load(object)
        end
    end
end