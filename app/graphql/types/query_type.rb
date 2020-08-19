module Types
  class QueryType < Types::BaseObject
    field :user, Types::UserType, null: true

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
  end
end
