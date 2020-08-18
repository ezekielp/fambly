class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token
    helper_method 

    def logged_in?
        !!current_user
    end

    def current_user
        @current_user ||= User.find_by(session_token: session[:session_token])
        @current_user
    end

    def login_user(user)
        session[:session_token] = user.reset_session_token!
        @current_user = user

        set_session_expiration
    end

    def session_token_expired?
        session[:expires_at] < Time.current ? true : false
    end

    def set_session_expiration
        session[:expires_at] = Time.current + 45.days
    end

end
