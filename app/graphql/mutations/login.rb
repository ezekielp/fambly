module Types
    class LoginInputType < Types::BaseInputObject
        argument :email, String, required: true
        argument :password, String, required: true
    end
end

module Mutations
    class Login < BaseMutation
        argument :input, Types::LoginInputType, required: true

        field :user, Types::UserType, null: true

        def resolve(input:)
            user = User.find_by_credentials(
                input.email,
                input.password
            )

            if user
                login_user(user)
            end

            { user: current_user }
        end
    end
end