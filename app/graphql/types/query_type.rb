module Types
  class QueryType < Types::BaseObject
    field :user, Types::UserType, null: true
    field :person_by_id, Types::PersonType, null: true do
      argument :person_id, String, required: true
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

  end
end
