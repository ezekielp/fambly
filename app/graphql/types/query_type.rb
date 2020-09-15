module Types
  class QueryType < Types::BaseObject
    field :user, Types::UserType, null: true
    field :person_by_id, Types::PersonType, null: true do
      argument :person_id, String, required: true
    end
    field :parent_child_relationship_by_parent_id_and_child_id, Types::ParentChildType, null: true do
      argument :input, Types::ParentChildInputType, required: true
    end

    delegate :logged_in?,
             :current_user,
             :login_user,
             :logout,
             :session_token_expired?,
             :set_session_expiration,
             to: :authentication_context

    def authentication_context
      context[:authentication_context]
    end

    def user
      current_user
    end

    def person_by_id(args)
      return nil unless args

      Person.find(args[:person_id])
    end

    def parent_child_relationship_by_parent_id_and_child_id(args)
      return nil unless args

      ParentChild.find_by(parent_id: args[:input][:parent_id], child_id: args[:input][:child_id])
    end
  end
end
