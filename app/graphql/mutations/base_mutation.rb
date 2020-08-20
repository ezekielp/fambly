module Mutations
  class BaseMutation < GraphQL::Schema::Mutation
    null false

    field :errors, [Types::ErrorType], null: true

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

    def resolve(*)
      yield
    rescue StandardError => e
      {
        errors: e.messages.map { |path, messages| { path: path, message: messages.join('. ') } }
      }
    end

  end
end
