class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token

    def authentication_context
        @authentication_context ||= AuthenticationContext.new(request)
    end

    delegate :logged_in?,
             :current_user,
             :login_user,
             :logout,
             :session_token_expired?,
             :set_session_expiration,
             to: :authentication_context

    def append_info_to_payload(payload)
        super
        case
            when payload[:status] == 200
                payload[:level] = "INFO"
            when payload[:status] == 302
                payload[:level] = "WARN"
            else
                payload[:level] = "ERROR"
        end
    end
end
