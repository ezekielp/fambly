module Types
    class CreateUserInputType < Types::BaseInputObject
        argument :email, String, required: true
        argument :password, String, required: true
    end
end

module Mutations
    class CreateUser < BaseMutation
        argument :input, Types::CreateUserInputType, required: true

        field :user, Types::UserType, null: true

        def resolve(input:)
            user = User.new(
                email: input.email,
                password: input.password
            )

            if user.save
                if current_user
                    user.people = current_user.people
                end

                login_user(user)
                return { user: current_user }
            end

            { errors: [{ path: 'email', message: 'This email address is already associated with a Fambly account!' }] }
        end
    end
end