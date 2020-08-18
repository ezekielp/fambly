class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token

    def authentication_context
        @authentication_context ||= AuthenticationContext.new(request)
    end

    delegate :logged_in?,
             :current_user,
             :login_user,
             :session_token_expired?,
             :set_session_expiration,
             to: :authentication_context

end
