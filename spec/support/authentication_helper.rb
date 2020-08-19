require 'rails_helper'

module AuthenticationHelper
    
    def login_user(user)
        query_string = "
            mutation Login($input: LoginInput!) {
                login(input: $input) {
                    user {
                        id
                        email
                    }
                }
            }
        "

        variables = {
            input: {
                email: user[:email],
                password: user[:password]
            }
        }

        post(
            '/graphql',
            params: { query: query_string, variables: variables }
        )
    end

end